# Architecture Planning Document

## System Architecture Overview

### Design Philosophy

**Simplicity First**: Every architectural decision prioritizes **ease of implementation and maintenance** while ensuring mathematical accuracy and performance. The system uses minimal abstractions necessary to support the core probability calculation functionality.

**Dual-Language Integration**: Leverage TypeScript for interactive UI and Python for mathematical calculations, with clean integration through Cloudflare Workers API endpoints.

**Type-Safe by Design**: Comprehensive TypeScript coverage with strict configuration ensures reliability and excellent developer experience across the frontend and API layer.

## Layered Architecture

### 1. Presentation Layer (Frontend)
```
┌─────────────────────────────────────┐
│         React Application           │
├─────────────────────────────────────┤
│  Components                         │
│  ├── DeckDisplay                    │
│  ├── CardEditor                     │
│  ├── ProbabilityCalculator          │
│  └── ResultsDisplay                 │
├─────────────────────────────────────┤
│  State Management                   │
│  ├── useDeck (deck state)           │
│  ├── useCalculator (calculator UI)  │
│  └── React Built-in Hooks           │
├─────────────────────────────────────┤
│  UI Components                      │
│  ├── Card (visual card display)     │
│  ├── Button, Input, Select          │
│  └── Layout Components              │
└─────────────────────────────────────┘
```

### 2. API Client Layer
```
┌─────────────────────────────────────┐
│        API Client                   │
├─────────────────────────────────────┤
│  HTTP Client (Fetch)                │
│  ├── Calculate Probability Request  │
│  ├── Request Validation             │
│  └── Error Handling                 │
├─────────────────────────────────────┤
│  Type Definitions                   │
│  ├── Card Types                     │
│  ├── Calculation Request/Response   │
│  └── Error Types                    │
└─────────────────────────────────────┘
```

### 3. Backend Layer (Cloudflare Workers)
```
┌─────────────────────────────────────┐
│     Cloudflare Worker               │
├─────────────────────────────────────┤
│  API Routes                         │
│  ├── POST /api/calculate            │
│  ├── Health Check Endpoint          │
│  └── Request Validation             │
├─────────────────────────────────────┤
│  Python Integration                 │
│  ├── Spawn Python Process           │
│  ├── Pass Calculation Parameters    │
│  ├── Receive Results                │
│  └── Error Handling                 │
└─────────────────────────────────────┘
```

### 4. Calculation Engine (Python)
```
┌─────────────────────────────────────┐
│     Python Calculation Module       │
├─────────────────────────────────────┤
│  Hypergeometric Distribution        │
│  ├── scipy.stats.hypergeom          │
│  ├── Probability Calculation        │
│  ├── Complementary Probability      │
│  └── Input Validation               │
├─────────────────────────────────────┤
│  Deck Analysis                      │
│  ├── Count Matching Cards           │
│  ├── Validate Parameters            │
│  └── Format Results                 │
└─────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

#### 1. App Component (Root)
```typescript
// src/App.tsx
export function App() {
  const { deck, addCard, removeCard, modifyCard, resetDeck } = useDeck()
  const {
    calculationParams,
    result,
    isCalculating,
    calculate,
    updateParams
  } = useCalculator()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <DeckDisplay
          deck={deck}
          onAddCard={addCard}
          onRemoveCard={removeCard}
          onModifyCard={modifyCard}
          onReset={resetDeck}
        />
        <ProbabilityCalculator
          params={calculationParams}
          onParamsChange={updateParams}
          onCalculate={calculate}
          isCalculating={isCalculating}
        />
        {result && <ResultsDisplay result={result} />}
      </main>
    </div>
  )
}
```

#### 2. DeckDisplay Component
```typescript
// src/components/DeckDisplay.tsx
interface DeckDisplayProps {
  deck: Card[]
  onAddCard: (card: Card) => void
  onRemoveCard: (cardIndex: number) => void
  onModifyCard: (cardIndex: number, newCard: Card) => void
  onReset: () => void
}

export function DeckDisplay({
  deck,
  onAddCard,
  onRemoveCard,
  onModifyCard,
  onReset
}: DeckDisplayProps) {
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set())
  const [isEditing, setIsEditing] = useState(false)

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Deck ({deck.length} cards)
        </h2>
        <div className="space-x-2">
          <Button onClick={() => setIsEditing(true)}>Add Card</Button>
          <Button onClick={onReset} variant="secondary">
            Reset to Standard Deck
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-13 gap-2">
        {deck.map((card, index) => (
          <Card
            key={`${card.rank}-${card.suit}-${index}`}
            card={card}
            selected={selectedCards.has(index)}
            onSelect={() => toggleSelection(index)}
            onModify={() => startModifying(index)}
            onDelete={() => onRemoveCard(index)}
          />
        ))}
      </div>

      {isEditing && (
        <CardEditor
          onSave={(card) => {
            onAddCard(card)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </section>
  )
}
```

#### 3. ProbabilityCalculator Component
```typescript
// src/components/ProbabilityCalculator.tsx
interface CalculatorParams {
  drawCount: number
  atLeastCount: number
  searchType: 'rank' | 'suit' | 'color'
  searchValue: string
}

interface ProbabilityCalculatorProps {
  params: CalculatorParams
  onParamsChange: (params: CalculatorParams) => void
  onCalculate: () => Promise<void>
  isCalculating: boolean
}

export function ProbabilityCalculator({
  params,
  onParamsChange,
  onCalculate,
  isCalculating
}: ProbabilityCalculatorProps) {
  const updateField = <K extends keyof CalculatorParams>(
    field: K,
    value: CalculatorParams[K]
  ) => {
    onParamsChange({ ...params, [field]: value })
  }

  return (
    <section className="bg-gray-800 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Calculate Probability</h2>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <FormField label="Draw Count">
          <Input
            type="number"
            min={1}
            value={params.drawCount}
            onChange={(e) => updateField('drawCount', parseInt(e.target.value))}
          />
        </FormField>

        <FormField label="At Least">
          <Input
            type="number"
            min={1}
            max={params.drawCount}
            value={params.atLeastCount}
            onChange={(e) => updateField('atLeastCount', parseInt(e.target.value))}
          />
        </FormField>

        <FormField label="Search Type">
          <Select
            value={params.searchType}
            onChange={(e) => updateField('searchType', e.target.value as any)}
          >
            <option value="rank">By Rank</option>
            <option value="suit">By Suit</option>
            <option value="color">By Color</option>
          </Select>
        </FormField>

        <FormField label="Search Value">
          <SearchValueSelect
            type={params.searchType}
            value={params.searchValue}
            onChange={(value) => updateField('searchValue', value)}
          />
        </FormField>
      </div>

      <Button
        onClick={onCalculate}
        disabled={isCalculating}
        className="w-full"
      >
        {isCalculating ? 'Calculating...' : 'Calculate Probability'}
      </Button>
    </section>
  )
}
```

#### 4. Card Component (Balatro-Style)
```typescript
// src/components/ui/Card.tsx
interface CardProps {
  card: Card
  selected?: boolean
  onSelect?: () => void
  onModify?: () => void
  onDelete?: () => void
}

export function Card({
  card,
  selected = false,
  onSelect,
  onModify,
  onDelete
}: CardProps) {
  const suitColor = getSuitColor(card.suit)
  const suitSymbol = getSuitSymbol(card.suit)

  return (
    <div
      className={cn(
        "relative aspect-[2/3] rounded-lg border-2 transition-all cursor-pointer",
        "bg-white text-gray-900",
        selected && "ring-4 ring-blue-500 scale-105",
        "hover:scale-105"
      )}
      onClick={onSelect}
    >
      {/* Card Content */}
      <div className="absolute inset-0 p-2 flex flex-col justify-between">
        <div className={cn("text-lg font-bold", suitColor)}>
          {card.rank}
          <div className="text-2xl">{suitSymbol}</div>
        </div>
        <div className={cn("text-lg font-bold text-right", suitColor)}>
          {suitSymbol}
          <div className="text-base">{card.rank}</div>
        </div>
      </div>

      {/* Action Buttons (shown on hover) */}
      {(onModify || onDelete) && (
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onModify && (
            <Button size="sm" onClick={onModify}>Edit</Button>
          )}
          {onDelete && (
            <Button size="sm" variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
```

#### 5. ResultsDisplay Component
```typescript
// src/components/ResultsDisplay.tsx
interface CalculationResult {
  probability: number
  explanation: string
  deckSize: number
  matchingCards: number
  drawCount: number
  atLeastCount: number
}

interface ResultsDisplayProps {
  result: CalculationResult
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const percentageDisplay = (result.probability * 100).toFixed(2)

  return (
    <section className="bg-green-900 border-2 border-green-600 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Result</h2>

      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-green-400 mb-2">
          {percentageDisplay}%
        </div>
        <p className="text-lg text-gray-300">{result.explanation}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <Stat label="Deck Size" value={result.deckSize} />
        <Stat label="Matching Cards" value={result.matchingCards} />
        <Stat label="Drawing" value={result.drawCount} />
        <Stat label="Need At Least" value={result.atLeastCount} />
      </div>
    </section>
  )
}
```

## State Management Architecture

### Custom Hooks

#### useDeck Hook
```typescript
// src/hooks/useDeck.ts
interface Card {
  rank: CardRank
  suit: CardSuit
}

type CardRank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' |
                'Jack' | 'Queen' | 'King' | 'Ace'
type CardSuit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades'

function createStandardDeck(): Card[] {
  const ranks: CardRank[] = [
    '2', '3', '4', '5', '6', '7', '8', '9', '10',
    'Jack', 'Queen', 'King', 'Ace'
  ]
  const suits: CardSuit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades']

  return suits.flatMap(suit =>
    ranks.map(rank => ({ rank, suit }))
  )
}

export function useDeck() {
  const [deck, setDeck] = useState<Card[]>(createStandardDeck)

  const addCard = useCallback((card: Card) => {
    setDeck(prev => [...prev, card])
  }, [])

  const removeCard = useCallback((index: number) => {
    setDeck(prev => prev.filter((_, i) => i !== index))
  }, [])

  const modifyCard = useCallback((index: number, newCard: Card) => {
    setDeck(prev => prev.map((card, i) => i === index ? newCard : card))
  }, [])

  const resetDeck = useCallback(() => {
    setDeck(createStandardDeck())
  }, [])

  return { deck, addCard, removeCard, modifyCard, resetDeck }
}
```

#### useCalculator Hook
```typescript
// src/hooks/useCalculator.ts
import { calculateProbability } from '@/lib/api/calculator'

interface CalculatorParams {
  drawCount: number
  atLeastCount: number
  searchType: 'rank' | 'suit' | 'color'
  searchValue: string
}

export function useCalculator() {
  const [params, setParams] = useState<CalculatorParams>({
    drawCount: 5,
    atLeastCount: 1,
    searchType: 'rank',
    searchValue: 'Ace'
  })
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculate = useCallback(async (deck: Card[]) => {
    setIsCalculating(true)
    setError(null)

    try {
      const response = await calculateProbability({
        deck,
        drawCount: params.drawCount,
        atLeastCount: params.atLeastCount,
        searchType: params.searchType,
        searchValue: params.searchValue
      })

      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed')
      setResult(null)
    } finally {
      setIsCalculating(false)
    }
  }, [params])

  return {
    params,
    result,
    error,
    isCalculating,
    updateParams: setParams,
    calculate
  }
}
```

## API Architecture

### Type-Safe API Client

```typescript
// src/lib/api/calculator.ts
interface CalculationRequest {
  deck: Card[]
  drawCount: number
  atLeastCount: number
  searchType: 'rank' | 'suit' | 'color'
  searchValue: string
}

interface CalculationResponse {
  probability: number
  explanation: string
  deckSize: number
  matchingCards: number
  drawCount: number
  atLeastCount: number
}

export async function calculateProbability(
  request: CalculationRequest
): Promise<CalculationResponse> {
  const response = await fetch('/api/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Calculation failed')
  }

  return response.json()
}
```

### Backend API (Cloudflare Worker)

```typescript
// worker/index.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      })
    }

    // Route: POST /api/calculate
    if (url.pathname === '/api/calculate' && request.method === 'POST') {
      try {
        const body = await request.json() as CalculationRequest

        // Validate request
        const validation = validateCalculationRequest(body)
        if (!validation.valid) {
          return jsonResponse({ error: validation.error }, 400)
        }

        // Call Python calculation engine
        const result = await runPythonCalculation(body)

        return jsonResponse(result, 200)
      } catch (error) {
        return jsonResponse({
          error: error instanceof Error ? error.message : 'Internal server error'
        }, 500)
      }
    }

    return jsonResponse({ error: 'Not found' }, 404)
  }
}

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
```

### Python Integration

```typescript
// worker/python-integration.ts
async function runPythonCalculation(
  request: CalculationRequest
): Promise<CalculationResponse> {
  // Count matching cards in deck
  const matchingCards = countMatchingCards(
    request.deck,
    request.searchType,
    request.searchValue
  )

  // Prepare Python script input
  const pythonInput = {
    population_size: request.deck.length,
    success_states: matchingCards,
    sample_size: request.drawCount,
    observed_successes: request.atLeastCount
  }

  // Execute Python calculation
  // Note: Implementation depends on Cloudflare Workers Python runtime
  // This is a conceptual example
  const probability = await executePython('calculate_probability.py', pythonInput)

  // Format response
  return {
    probability,
    explanation: formatExplanation(request, matchingCards),
    deckSize: request.deck.length,
    matchingCards,
    drawCount: request.drawCount,
    atLeastCount: request.atLeastCount
  }
}

function countMatchingCards(
  deck: Card[],
  searchType: string,
  searchValue: string
): number {
  return deck.filter(card => {
    switch (searchType) {
      case 'rank':
        return card.rank === searchValue
      case 'suit':
        return card.suit === searchValue
      case 'color':
        const color = (card.suit === 'Hearts' || card.suit === 'Diamonds')
          ? 'Red' : 'Black'
        return color === searchValue
      default:
        return false
    }
  }).length
}
```

## Python Calculation Module

```python
# worker/calculate_probability.py
from scipy.stats import hypergeom
import sys
import json

def calculate_at_least_probability(
    population_size: int,
    success_states: int,
    sample_size: int,
    at_least_count: int
) -> float:
    """
    Calculate probability of drawing at least k successes using hypergeometric distribution.

    P(X >= k) = 1 - P(X < k) = 1 - P(X <= k-1)
    """
    if at_least_count == 0:
        return 1.0

    if at_least_count > sample_size or at_least_count > success_states:
        return 0.0

    # Calculate cumulative probability up to (at_least_count - 1)
    cumulative_prob = hypergeom.cdf(
        at_least_count - 1,
        population_size,
        success_states,
        sample_size
    )

    # Probability of at least k is complement of less than k
    return 1.0 - cumulative_prob

def main():
    # Read input from stdin
    input_data = json.loads(sys.stdin.read())

    population_size = input_data['population_size']
    success_states = input_data['success_states']
    sample_size = input_data['sample_size']
    observed_successes = input_data['observed_successes']

    # Calculate probability
    probability = calculate_at_least_probability(
        population_size,
        success_states,
        sample_size,
        observed_successes
    )

    # Output result
    print(json.dumps({'probability': probability}))

if __name__ == '__main__':
    main()
```

## Data Flow

### Calculation Request Flow
```
1. User inputs parameters in ProbabilityCalculator
   ↓
2. useCalculator hook validates inputs
   ↓
3. calculateProbability API call with deck + params
   ↓
4. Cloudflare Worker receives request
   ↓
5. Worker validates request parameters
   ↓
6. Worker counts matching cards in deck
   ↓
7. Worker calls Python calculation module
   ↓
8. Python calculates probability using scipy
   ↓
9. Worker formats response with explanation
   ↓
10. Frontend displays result in ResultsDisplay
```

### Deck Management Flow
```
1. User interacts with DeckDisplay (add/edit/delete)
   ↓
2. useDeck hook updates deck state
   ↓
3. DeckDisplay re-renders with updated deck
   ↓
4. Card components show current deck state
```

## Error Handling

### Validation Layers

#### Frontend Validation
```typescript
function validateCalculationParams(
  deck: Card[],
  params: CalculatorParams
): { valid: boolean; error?: string } {
  if (deck.length === 0) {
    return { valid: false, error: 'Deck cannot be empty' }
  }

  if (params.drawCount < 1) {
    return { valid: false, error: 'Must draw at least 1 card' }
  }

  if (params.drawCount > deck.length) {
    return { valid: false, error: 'Cannot draw more cards than deck contains' }
  }

  if (params.atLeastCount < 1) {
    return { valid: false, error: 'At least count must be 1 or more' }
  }

  if (params.atLeastCount > params.drawCount) {
    return { valid: false, error: 'At least count cannot exceed draw count' }
  }

  return { valid: true }
}
```

#### Backend Validation
```typescript
function validateCalculationRequest(
  request: CalculationRequest
): { valid: boolean; error?: string } {
  // Same validations as frontend plus additional security checks
  if (!Array.isArray(request.deck)) {
    return { valid: false, error: 'Deck must be an array' }
  }

  if (request.deck.length > 1000) {
    return { valid: false, error: 'Deck size exceeds maximum limit' }
  }

  // Validate each card
  for (const card of request.deck) {
    if (!isValidCard(card)) {
      return { valid: false, error: 'Invalid card in deck' }
    }
  }

  return { valid: true }
}
```

This architecture provides a clean, maintainable foundation for the card probability calculator with clear separation of concerns and type-safe integration between TypeScript and Python components.
