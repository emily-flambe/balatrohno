# Frontend Specification

## Guiding Principles

**SIMPLICITY FIRST**: Build the minimum viable interface. No fancy animations, no complex state machines, no premature abstractions.

**NO OVERENGINEERING**: If you're writing more than 50 lines of code for a component, you're probably overthinking it.

**MAKE IT WORK, THEN MAKE IT PRETTY**: Get the functionality correct first. Polish comes later.

## Component Structure

### Minimal Component Tree

```
App
├── DeckDisplay (shows cards in grid)
├── DeckControls (add/delete buttons)
└── Calculator (inputs + result)
```

**Three components. That's all we need for MVP.**

## Component Specifications

### App Component

```typescript
// src/App.tsx
function App() {
  const [deck, setDeck] = useState<Card[]>(createStandardDeck())

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Balatro Probability Calculator</h1>

      <DeckDisplay deck={deck} onRemoveCard={(id) =>
        setDeck(deck.filter(c => c.id !== id))
      } />

      <DeckControls onAddCard={(card) =>
        setDeck([...deck, card])
      } />

      <Calculator deck={deck} />
    </div>
  )
}
```

**Simple. Deck state lives here, gets passed down as props.**

### DeckDisplay Component

```typescript
// src/components/DeckDisplay.tsx
interface DeckDisplayProps {
  deck: Card[]
  onRemoveCard: (id: string) => void
}

function DeckDisplay({ deck, onRemoveCard }: DeckDisplayProps) {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-2">
        Total cards: {deck.length}
      </p>

      <div className="grid grid-cols-13 gap-2">
        {deck.map(card => (
          <Card
            key={card.id}
            rank={card.rank}
            suit={card.suit}
            onDelete={() => onRemoveCard(card.id)}
          />
        ))}
      </div>
    </div>
  )
}
```

**Grid of cards. Count at top. No selection, no edit mode, no complex interactions in MVP.**

### Card Component

```typescript
// src/components/Card.tsx
interface CardProps {
  rank: Rank
  suit: Suit
  onDelete: () => void
}

function Card({ rank, suit, onDelete }: CardProps) {
  const color = suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-black'
  const symbol = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' }[suit]

  return (
    <div className="border rounded p-2 relative group">
      <div className={color}>
        <div className="text-lg font-bold">{rank}</div>
        <div className="text-2xl">{symbol}</div>
      </div>

      <button
        onClick={onDelete}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-xs"
      >
        ×
      </button>
    </div>
  )
}
```

**Delete button shows on hover. That's the only interaction needed.**

### DeckControls Component

```typescript
// src/components/DeckControls.tsx
interface DeckControlsProps {
  onAddCard: (card: Card) => void
}

function DeckControls({ onAddCard }: DeckControlsProps) {
  const [rank, setRank] = useState<Rank>('A')
  const [suit, setSuit] = useState<Suit>('hearts')

  const handleAdd = () => {
    onAddCard({
      id: `card-${Date.now()}`, // Simple unique ID
      rank,
      suit
    })
  }

  return (
    <div className="my-4 flex gap-2">
      <select value={rank} onChange={(e) => setRank(e.target.value as Rank)}>
        {['2','3','4','5','6','7','8','9','10','J','Q','K','A'].map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      <select value={suit} onChange={(e) => setSuit(e.target.value as Suit)}>
        <option value="hearts">♥ Hearts</option>
        <option value="diamonds">♦ Diamonds</option>
        <option value="clubs">♣ Clubs</option>
        <option value="spades">♠ Spades</option>
      </select>

      <button onClick={handleAdd} className="px-4 py-2 bg-blue-500 text-white rounded">
        Add Card
      </button>
    </div>
  )
}
```

**Two dropdowns, one button. No validation, no fancy forms, no complexity.**

### Calculator Component

```typescript
// src/components/Calculator.tsx
interface CalculatorProps {
  deck: Card[]
}

function Calculator({ deck }: CalculatorProps) {
  const [drawCount, setDrawCount] = useState(5)
  const [minMatches, setMinMatches] = useState(1)
  const [searchType, setSearchType] = useState<'rank' | 'suit' | 'color'>('rank')
  const [searchValue, setSearchValue] = useState('A')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCalculate = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deck: deck.map(c => ({ rank: c.rank, suit: c.suit })),
          drawCount,
          minMatches,
          searchType,
          searchValue
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Calculation failed')
      }

      const data = await response.json()
      setResult(`${data.percentage} chance`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h2 className="text-xl font-bold mb-4">Calculate Probability</h2>

      <div className="space-y-4">
        <div>
          <label>Draw how many cards?</label>
          <input
            type="number"
            value={drawCount}
            onChange={(e) => setDrawCount(parseInt(e.target.value))}
            className="ml-2 border px-2 py-1"
            min="1"
          />
        </div>

        <div>
          <label>At least how many matches?</label>
          <input
            type="number"
            value={minMatches}
            onChange={(e) => setMinMatches(parseInt(e.target.value))}
            className="ml-2 border px-2 py-1"
            min="1"
          />
        </div>

        <div>
          <label>Search by:</label>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="ml-2 border px-2 py-1"
          >
            <option value="rank">Rank</option>
            <option value="suit">Suit</option>
            <option value="color">Color</option>
          </select>
        </div>

        <div>
          <label>Search for:</label>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="ml-2 border px-2 py-1"
            placeholder="e.g., A, hearts, red"
          />
        </div>

        <button
          onClick={handleCalculate}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
        >
          {isLoading ? 'Calculating...' : 'Calculate'}
        </button>

        {error && (
          <div className="text-red-600 mt-2">{error}</div>
        )}

        {result && (
          <div className="text-lg font-bold mt-2">{result}</div>
        )}
      </div>
    </div>
  )
}
```

**All inputs in one component. Direct state updates. No form library, no validation schema, no abstractions.**

## Styling Approach

### Use Tailwind Utility Classes

**DO:**
- Use inline Tailwind classes
- Keep it simple and readable
- Copy patterns that work

**DON'T:**
- Create custom CSS files
- Build a design system
- Abstract everything into variants

```typescript
// ✅ Good
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Click me
</button>

// ❌ Overkill for MVP
<Button variant="primary" size="md" intent="action">
  Click me
</Button>
```

## Responsive Design

### Mobile-First, Simple Breakpoints

```typescript
// Desktop: grid with 13 columns (one per rank)
<div className="grid grid-cols-13 gap-2">

// Mobile: let it wrap naturally
<div className="grid grid-cols-4 sm:grid-cols-13 gap-2">
```

**That's it. Don't overcomplicate responsive design.**

## User Interactions

### What Users Can Do

1. **View deck**: See all cards in a grid
2. **Add card**: Select rank/suit, click Add
3. **Delete card**: Hover over card, click X
4. **Calculate probability**: Fill form, click Calculate
5. **See result**: Read percentage

### What's NOT in MVP

- Selecting multiple cards
- Editing existing cards
- Drag and drop
- Keyboard shortcuts
- Card animations
- Undo/redo
- Deck templates
- Save/load

## Accessibility

### Basic Accessibility Only

```typescript
// ✅ Do these basics
<button aria-label="Delete card">×</button>
<input type="number" aria-label="Draw count" />

// ❌ Don't go overboard with ARIA
// Skip: aria-describedby, aria-controls, live regions, etc. for MVP
```

**Make it keyboard accessible and screen-reader friendly. Don't spend a week on WCAG AAA compliance.**

## Error Handling

### Simple Error Display

```typescript
// ✅ Good enough
{error && <div className="text-red-600">{error}</div>}

// ❌ Overengineered
<ErrorBoundary fallback={<ErrorFallback />}>
  <Toast type="error" duration={5000} dismissible onDismiss={...}>
    <ErrorIcon />
    <ErrorMessage>{error}</ErrorMessage>
  </Toast>
</ErrorBoundary>
```

## Loading States

### Minimal Loading Feedback

```typescript
// ✅ Simple
<button disabled={isLoading}>
  {isLoading ? 'Calculating...' : 'Calculate'}
</button>

// ❌ Unnecessary
<Spinner size="lg" variant="primary" />
<ProgressBar value={progress} />
<Skeleton count={3} />
```

## Performance

### Don't Optimize Prematurely

**DON'T DO THIS for MVP:**
```typescript
// ❌ Premature optimization
const memoizedDeck = useMemo(() => deck, [deck])
const memoizedHandlers = useCallback(() => { ... }, [dependencies])
const DeckDisplay = memo(DeckDisplayComponent)
```

**ONLY optimize if:**
- Profiler shows actual performance problem
- Users complain it's slow
- Renders take >100ms

## Testing Strategy

### Minimal Testing for MVP

**Test these:**
1. Does it build? (`npm run build`)
2. Does it run? (Open in browser)
3. Can you add a card? (Manual test)
4. Can you delete a card? (Manual test)
5. Does calculate return a result? (Manual test)

**DON'T test:**
- Unit tests for every component
- Integration tests for all interactions
- E2E tests for every user flow
- 80% code coverage goals

**Add tests LATER when:**
- You have bugs you need to prevent regression on
- Code is stable enough to warrant tests
- You actually have users who would be affected by bugs

## File Structure

```
src/
├── components/
│   ├── Card.tsx
│   ├── DeckDisplay.tsx
│   ├── DeckControls.tsx
│   └── Calculator.tsx
├── lib/
│   └── deck.ts (createStandardDeck function)
├── types.ts (Card, Rank, Suit types)
├── App.tsx
└── main.tsx
```

**Flat structure. No layers of folders. Easy to find everything.**

## Anti-Patterns to Avoid

### Don't Build These

```typescript
// ❌ Component library
components/ui/button/Button.tsx
components/ui/button/Button.test.tsx
components/ui/button/Button.stories.tsx
components/ui/button/Button.types.ts
components/ui/button/index.ts

// ❌ Over-abstracted state
const { state, dispatch } = useDeckState()
const actions = useDeckActions()
const selectors = useDeckSelectors()

// ❌ Complex form handling
const { register, handleSubmit, formState: { errors } } = useForm()
const schema = z.object({ ... })
const validatedData = schema.parse(data)
```

## Summary

**Build the simplest thing that works:**

- 4 components total
- Props for passing data
- useState for state
- Tailwind for styling
- No libraries except React and Tailwind
- Manual testing only
- Add complexity ONLY when simplicity fails
