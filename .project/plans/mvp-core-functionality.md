# MVP Core Functionality

Technical specification for core probability calculator functionality.

## Goal

Working calculator that gives accurate probabilities for Balatro players during gameplay.

## Requirements

### 1. Standard Deck Initialization
- Create standard 52-card deck (13 ranks x 4 suits)
- Clear visual representation of all cards
- Display total card count prominently

**Technical Details:**
```typescript
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'

interface Card {
  id: string
  rank: Rank
  suit: Suit
}

function createStandardDeck(): Card[] {
  // Generate all 52 cards
}
```

### 2. Deck Display
- Grid layout of all cards
- Balatro-style visual design
- Responsive layout (desktop and mobile)
- Each card shows rank and suit clearly

**Component:**
```typescript
function DeckDisplay({ deck, onRemoveCard }: DeckDisplayProps) {
  // Display cards in grid
  // Click card to remove
  // Show total count
}
```

### 3. Deck Modification
- **Add Card**: Dropdown selectors for rank and suit
- **Remove Card**: Click card to remove from deck
- **Visual Feedback**: Clear indication of actions

**Component:**
```typescript
function DeckControls({ onAddCard }: DeckControlsProps) {
  const [rank, setRank] = useState<Rank>('A')
  const [suit, setSuit] = useState<Suit>('hearts')

  // Simple form with dropdowns
  // Add button
}
```

### 4. Probability Calculator
- **Inputs:**
  - Draw count (number input)
  - Minimum matches (number input)
  - Search type (dropdown: rank, suit, color)
  - Search value (dropdown based on type)

- **Output:**
  - Probability as percentage
  - Clear explanation of what was calculated

**Component:**
```typescript
function Calculator({ deck }: CalculatorProps) {
  const [drawCount, setDrawCount] = useState(5)
  const [minMatches, setMinMatches] = useState(1)
  const [searchType, setSearchType] = useState<'rank' | 'suit' | 'color'>('rank')
  const [searchValue, setSearchValue] = useState<string>('A')

  // Calculate button
  // Display result
}
```

### 5. Backend Calculation
- Single endpoint: `POST /api/calculate`
- Python with scipy.stats.hypergeom
- Input validation
- Error handling

**Python Worker:**
```python
from scipy.stats import hypergeom

def calculate_probability(deck_size, matching_cards, draw_count, min_matches):
    if min_matches == 1:
        return 1.0 - hypergeom.pmf(0, deck_size, matching_cards, draw_count)

    return 1.0 - hypergeom.cdf(min_matches - 1, deck_size, matching_cards, draw_count)
```

### 6. API Integration
- Fetch call from frontend
- JSON request/response
- Error handling
- Loading state

**API Call:**
```typescript
async function calculateProbability(request: CalculationRequest): Promise<number> {
  const response = await fetch('/api/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })

  if (!response.ok) throw new Error('Calculation failed')

  const data = await response.json()
  return data.probability
}
```

## Success Criteria

- [ ] Can see all 52 cards in standard deck
- [ ] Can click card to remove it
- [ ] Can add card via dropdowns
- [ ] Total card count updates correctly
- [ ] Can enter draw parameters
- [ ] Can select search criteria
- [ ] Calculate button calls API
- [ ] Result displays as percentage
- [ ] Works on desktop browser
- [ ] Works on mobile browser

## Validation

Before considering this complete:
1. Open app in browser
2. See 52 cards displayed
3. Remove a card, count updates to 51
4. Add a card, count updates to 52
5. Enter query: "at least 1 Ace in 5 cards"
6. Click calculate
7. See result: approximately 34.1%
8. Test on mobile device or DevTools mobile view
9. Verify responsive layout works

## Not Included

- Deck persistence
- Calculation history
- Complex queries
- Balatro-specific cards
- Save/load functionality
- User accounts
- Analytics
