# Data Schema and State Management

## Overview

This document defines all data structures, type definitions, and state management patterns for the Balatro Card Probability Calculator. The application is stateless with no persistent storage, managing all state in-memory through React hooks.

## Core Data Types

### Card Type

The fundamental data structure representing a playing card.

```typescript
// src/lib/types/card.ts

/**
 * Playing card ranks in a standard deck
 */
export type CardRank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'Jack'
  | 'Queen'
  | 'King'
  | 'Ace'

/**
 * Playing card suits
 */
export type CardSuit =
  | 'Hearts'
  | 'Diamonds'
  | 'Clubs'
  | 'Spades'

/**
 * Derived type for card colors
 */
export type CardColor = 'Red' | 'Black'

/**
 * Represents a single playing card
 */
export interface Card {
  rank: CardRank
  suit: CardSuit
}

/**
 * Type guard to check if a value is a valid Card
 */
export function isCard(value: unknown): value is Card {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const card = value as Card

  const validRanks: CardRank[] = [
    '2', '3', '4', '5', '6', '7', '8', '9', '10',
    'Jack', 'Queen', 'King', 'Ace'
  ]
  const validSuits: CardSuit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades']

  return (
    validRanks.includes(card.rank) &&
    validSuits.includes(card.suit)
  )
}

/**
 * Get the color of a card based on its suit
 */
export function getCardColor(card: Card): CardColor {
  return card.suit === 'Hearts' || card.suit === 'Diamonds' ? 'Red' : 'Black'
}
```

### Deck Type

Represents a collection of cards.

```typescript
/**
 * A deck is simply an array of cards
 * Order matters for display but not for probability calculations
 */
export type Deck = Card[]

/**
 * Create a standard 52-card deck
 */
export function createStandardDeck(): Deck {
  const ranks: CardRank[] = [
    '2', '3', '4', '5', '6', '7', '8', '9', '10',
    'Jack', 'Queen', 'King', 'Ace'
  ]
  const suits: CardSuit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades']

  const deck: Deck = []
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit })
    }
  }

  return deck
}

/**
 * Validate that a deck contains only valid cards
 */
export function isDeck(value: unknown): value is Deck {
  if (!Array.isArray(value)) {
    return false
  }

  return value.every(isCard)
}
```

## Calculation Types

### Search Criteria

Types for specifying what cards to search for in probability calculations.

```typescript
// src/lib/types/calculation.ts

/**
 * Types of searches supported
 */
export type SearchType = 'rank' | 'suit' | 'color'

/**
 * Search value depends on search type
 * - rank: one of CardRank
 * - suit: one of CardSuit
 * - color: one of CardColor
 */
export type SearchValue = CardRank | CardSuit | CardColor

/**
 * Parameters for a probability calculation
 */
export interface CalculationParams {
  /** Number of cards to draw from the deck */
  drawCount: number

  /** Minimum number of matching cards required */
  atLeastCount: number

  /** Type of search criteria */
  searchType: SearchType

  /** Value to search for (interpretation depends on searchType) */
  searchValue: SearchValue
}

/**
 * Validate calculation parameters
 */
export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateCalculationParams(
  deck: Deck,
  params: CalculationParams
): ValidationResult {
  if (deck.length === 0) {
    return { valid: false, error: 'Deck cannot be empty' }
  }

  if (params.drawCount < 1) {
    return { valid: false, error: 'Must draw at least 1 card' }
  }

  if (params.drawCount > deck.length) {
    return {
      valid: false,
      error: `Cannot draw ${params.drawCount} cards from deck of ${deck.length}`
    }
  }

  if (params.atLeastCount < 1) {
    return { valid: false, error: 'At least count must be 1 or more' }
  }

  if (params.atLeastCount > params.drawCount) {
    return {
      valid: false,
      error: `At least count (${params.atLeastCount}) cannot exceed draw count (${params.drawCount})`
    }
  }

  return { valid: true }
}
```

### Calculation Request/Response

Types for API communication.

```typescript
/**
 * Request payload for probability calculation API
 */
export interface CalculationRequest {
  deck: Deck
  drawCount: number
  atLeastCount: number
  searchType: SearchType
  searchValue: SearchValue
}

/**
 * Response from probability calculation API
 */
export interface CalculationResponse {
  /** Probability value between 0.0 and 1.0 */
  probability: number

  /** Human-readable explanation of the result */
  explanation: string

  /** Total number of cards in the deck */
  deckSize: number

  /** Number of cards matching the search criteria */
  matchingCards: number

  /** Number of cards being drawn */
  drawCount: number

  /** Minimum matches required */
  atLeastCount: number
}

/**
 * Error response from API
 */
export interface ApiError {
  error: string
  details?: Record<string, unknown>
}
```

## Application State

### Deck State

Managed by the `useDeck` hook.

```typescript
// src/hooks/useDeck.ts

export interface DeckState {
  /** Current deck of cards */
  deck: Deck

  /** Add a card to the deck */
  addCard: (card: Card) => void

  /** Remove a card at specific index */
  removeCard: (index: number) => void

  /** Modify a card at specific index */
  modifyCard: (index: number, newCard: Card) => void

  /** Reset deck to standard 52-card deck */
  resetDeck: () => void
}

export function useDeck(): DeckState {
  const [deck, setDeck] = useState<Deck>(createStandardDeck)

  const addCard = useCallback((card: Card) => {
    setDeck(prev => [...prev, card])
  }, [])

  const removeCard = useCallback((index: number) => {
    setDeck(prev => prev.filter((_, i) => i !== index))
  }, [])

  const modifyCard = useCallback((index: number, newCard: Card) => {
    setDeck(prev => prev.map((card, i) => (i === index ? newCard : card)))
  }, [])

  const resetDeck = useCallback(() => {
    setDeck(createStandardDeck())
  }, [])

  return { deck, addCard, removeCard, modifyCard, resetDeck }
}
```

### Calculator State

Managed by the `useCalculator` hook.

```typescript
// src/hooks/useCalculator.ts

export interface CalculatorState {
  /** Current calculation parameters */
  params: CalculationParams

  /** Last calculation result (null if no calculation done) */
  result: CalculationResponse | null

  /** Error message from last calculation (null if no error) */
  error: string | null

  /** Whether a calculation is currently in progress */
  isCalculating: boolean

  /** Update calculation parameters */
  updateParams: (params: CalculationParams) => void

  /** Execute calculation with current params and given deck */
  calculate: (deck: Deck) => Promise<void>

  /** Clear result and error */
  clearResult: () => void
}

export function useCalculator(): CalculatorState {
  const [params, setParams] = useState<CalculationParams>({
    drawCount: 5,
    atLeastCount: 1,
    searchType: 'rank',
    searchValue: 'Ace'
  })

  const [result, setResult] = useState<CalculationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculate = useCallback(
    async (deck: Deck) => {
      setIsCalculating(true)
      setError(null)

      try {
        // Validate parameters
        const validation = validateCalculationParams(deck, params)
        if (!validation.valid) {
          throw new Error(validation.error)
        }

        // Make API call
        const response = await calculateProbability({
          deck,
          ...params
        })

        setResult(response)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Calculation failed'
        setError(message)
        setResult(null)
      } finally {
        setIsCalculating(false)
      }
    },
    [params]
  )

  const clearResult = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    params,
    result,
    error,
    isCalculating,
    updateParams: setParams,
    calculate,
    clearResult
  }
}
```

### UI State

Component-level state for UI interactions.

```typescript
// Example: DeckDisplay component state
interface DeckDisplayState {
  /** Set of card indices that are currently selected */
  selectedCards: Set<number>

  /** Whether card editor modal is open */
  isEditing: boolean

  /** Index of card being edited (null if adding new) */
  editingIndex: number | null
}

// Example: Card component state
interface CardState {
  /** Whether the card is currently being hovered */
  isHovered: boolean
}
```

## Utility Functions

### Card Utilities

```typescript
// src/lib/utils/card-utils.ts

/**
 * Get the suit symbol for display
 */
export function getSuitSymbol(suit: CardSuit): string {
  const symbols: Record<CardSuit, string> = {
    Hearts: '♥',
    Diamonds: '♦',
    Clubs: '♣',
    Spades: '♠'
  }
  return symbols[suit]
}

/**
 * Get CSS color class for a suit
 */
export function getSuitColorClass(suit: CardSuit): string {
  return suit === 'Hearts' || suit === 'Diamonds'
    ? 'text-red-600'
    : 'text-gray-900'
}

/**
 * Count cards in deck matching search criteria
 */
export function countMatchingCards(
  deck: Deck,
  searchType: SearchType,
  searchValue: SearchValue
): number {
  return deck.filter(card => matchesSearchCriteria(card, searchType, searchValue)).length
}

/**
 * Check if a card matches search criteria
 */
export function matchesSearchCriteria(
  card: Card,
  searchType: SearchType,
  searchValue: SearchValue
): boolean {
  switch (searchType) {
    case 'rank':
      return card.rank === searchValue
    case 'suit':
      return card.suit === searchValue
    case 'color':
      return getCardColor(card) === searchValue
    default:
      return false
  }
}

/**
 * Get all possible values for a search type
 */
export function getSearchValues(searchType: SearchType): SearchValue[] {
  switch (searchType) {
    case 'rank':
      return [
        '2', '3', '4', '5', '6', '7', '8', '9', '10',
        'Jack', 'Queen', 'King', 'Ace'
      ]
    case 'suit':
      return ['Hearts', 'Diamonds', 'Clubs', 'Spades']
    case 'color':
      return ['Red', 'Black']
  }
}
```

## Python Data Structures

### Input Format

Python calculation module receives JSON input.

```python
# Input JSON structure
{
    "population_size": 52,      # Total cards in deck
    "success_states": 4,        # Cards matching criteria
    "sample_size": 5,          # Cards being drawn
    "observed_successes": 1    # Minimum matches required
}
```

### Output Format

Python calculation module returns JSON output.

```python
# Output JSON structure
{
    "probability": 0.341  # Probability value (0.0 to 1.0)
}
```

## State Flow Diagram

```
User Interaction
       ↓
   Component
       ↓
   Hook (useDeck / useCalculator)
       ↓
   State Update
       ↓
   Re-render
       ↓
   Updated UI

Calculation Flow:
User clicks "Calculate"
       ↓
useCalculator.calculate(deck)
       ↓
Validate parameters
       ↓
API call to /api/calculate
       ↓
Worker receives request
       ↓
Worker counts matching cards
       ↓
Worker calls Python module
       ↓
Python calculates probability
       ↓
Worker formats response
       ↓
useCalculator receives response
       ↓
State updated with result
       ↓
ResultsDisplay renders
```

## Type Exports

All types should be exported from a central types file for easy importing.

```typescript
// src/lib/types/index.ts
export type {
  Card,
  CardRank,
  CardSuit,
  CardColor,
  Deck
} from './card'

export type {
  SearchType,
  SearchValue,
  CalculationParams,
  CalculationRequest,
  CalculationResponse,
  ApiError,
  ValidationResult
} from './calculation'

export {
  isCard,
  isDeck,
  getCardColor,
  createStandardDeck,
  validateCalculationParams
} from './card'
```

## State Persistence

### MVP: No Persistence

The MVP version has no persistence mechanism:
- No localStorage
- No sessionStorage
- No cookies
- No URL state

Deck resets to standard 52 cards on page reload.

### Future Enhancement: localStorage

Future versions may add optional persistence:

```typescript
// Future: Save deck to localStorage
function saveDeckToStorage(deck: Deck): void {
  localStorage.setItem('balatro-deck', JSON.stringify(deck))
}

// Future: Load deck from localStorage
function loadDeckFromStorage(): Deck | null {
  const stored = localStorage.getItem('balatro-deck')
  if (!stored) return null

  try {
    const parsed = JSON.parse(stored)
    return isDeck(parsed) ? parsed : null
  } catch {
    return null
  }
}
```

This schema provides complete type safety and clear state management patterns for the entire application.
