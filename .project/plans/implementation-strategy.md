# Implementation Strategy

How to build the MVP without overengineering.

## Core Principle

**Build the simplest thing that works. Add complexity only when proven necessary.**

## Build It Simple First

### No Testing (MVP)
- Manual testing only
- No test framework setup
- No test files
- No coverage reports

**Why:** Testing infrastructure adds complexity. Manual testing is sufficient for MVP. Add automated tests later if the project grows.

### No CI/CD
- Deploy manually with wrangler
- No GitHub Actions
- No automated pipelines
- No deployment scripts

**Why:** Manual deployment is fine for MVP. One command: `wrangler deploy`. Add automation only if deploying frequently.

### No Analytics
- No tracking code
- No user metrics
- No error reporting service
- No monitoring dashboard

**Why:** You don't have users yet. Add analytics when you need to understand user behavior.

### No Monitoring
- Cloudflare dashboard is enough
- No external monitoring service
- No alerts
- No uptime checks

**Why:** Cloudflare provides basic metrics. Add monitoring when the tool is critical to users.

### No Optimization
- scipy is fast enough
- No caching layer
- No CDN configuration
- No bundle optimization beyond Vite defaults

**Why:** Premature optimization wastes time. Optimize only when you measure a performance problem.

## Add Complexity Only When Needed

Before adding anything, ask:
1. **Do users actually want this?** (Evidence: user requests, bug reports)
2. **Is the current version broken without it?** (Evidence: failures, errors)
3. **Will this make the tool faster/simpler to use?** (Evidence: user feedback, metrics)

If all three answers are "no", don't build it.

## Implementation Order

### 1. Start with Core Functionality
Build in this order:
1. Display standard 52-card deck
2. Remove cards from deck
3. Add cards to deck
4. Calculate probability (backend)
5. Wire frontend to backend
6. Display result

**Why this order:** Each step builds on the previous. You can test incrementally.

### 2. Then Polish
Only after core works:
1. Style cards to look like Balatro
2. Improve error messages
3. Add validation feedback
4. Make responsive for mobile

**Why wait:** No point polishing broken functionality. Make it work first, then make it pretty.

### 3. Finally Deploy
Only after testing locally:
1. Build for production
2. Test production build
3. Deploy to Cloudflare Workers
4. Verify deployment works

**Why last:** Don't deploy broken code. Test everything locally first.

## Technical Decisions

### State Management
**Use:** React useState
**Don't use:** Redux, Zustand, Context API, Recoil

**Why:** This app has simple state. useState is sufficient. State management libraries add complexity without benefit.

### Styling
**Use:** Tailwind CSS utility classes
**Don't use:** CSS-in-JS, styled-components, Sass

**Why:** Tailwind is sufficient for MVP. No need for additional styling solutions.

### Component Library
**Use:** None, build custom components
**Don't use:** Material-UI, Chakra, shadcn/ui

**Why:** This app needs 4 components total. A component library adds unnecessary dependencies.

### Forms
**Use:** Plain React controlled components
**Don't use:** React Hook Form, Formik

**Why:** This app has simple forms. Controlled components are sufficient.

### API Client
**Use:** Native fetch
**Don't use:** Axios, React Query, SWR

**Why:** One API call. fetch is sufficient. No need for abstraction.

### Build Tool
**Use:** Vite (already chosen)
**Don't use:** Webpack, Rollup, Parcel

**Why:** Vite is fast and simple. No configuration needed.

## Anti-Patterns to Avoid

### Don't Abstract Early
Bad:
```typescript
// Creating abstraction before you need it
class DeckManager {
  private deck: Card[]

  constructor() { /* ... */ }
  addCard(card: Card) { /* ... */ }
  removeCard(id: string) { /* ... */ }
  serialize() { /* ... */ }
  deserialize(data: string) { /* ... */ }
}
```

Good:
```typescript
// Simple state and functions
const [deck, setDeck] = useState<Card[]>(createStandardDeck)

const addCard = (card: Card) => {
  setDeck(prev => [...prev, card])
}

const removeCard = (id: string) => {
  setDeck(prev => prev.filter(c => c.id !== id))
}
```

### Don't Add Unused Features
Bad:
```typescript
// Adding features "just in case"
interface Card {
  id: string
  rank: Rank
  suit: Suit
  isEnhanced?: boolean        // Not needed for MVP
  foil?: 'gold' | 'holographic'  // Not needed for MVP
  edition?: string             // Not needed for MVP
  jokerEffect?: JokerEffect    // Not needed for MVP
}
```

Good:
```typescript
// Only what's needed now
interface Card {
  id: string
  rank: Rank
  suit: Suit
}
```

### Don't Overcomplicate Types
Bad:
```typescript
// Over-engineered type system
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
type NumberRank = Extract<Rank, '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'>
type FaceRank = Extract<Rank, 'J' | 'Q' | 'K' | 'A'>
type RedSuit = Extract<Suit, 'hearts' | 'diamonds'>
type BlackSuit = Extract<Suit, 'clubs' | 'spades'>
```

Good:
```typescript
// Simple types that work
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
```

### Don't Premature Optimize
Bad:
```typescript
// Optimizing before measuring
const memoizedDeck = useMemo(() => deck, [deck])
const memoizedAddCard = useCallback((card) => { /* ... */ }, [])
const memoizedRemoveCard = useCallback((id) => { /* ... */ }, [])
```

Good:
```typescript
// Simple code that works
const [deck, setDeck] = useState<Card[]>(createStandardDeck)

const addCard = (card: Card) => {
  setDeck(prev => [...prev, card])
}
```

## Success Metrics

**MVP Success:**
- Can calculate probability correctly
- Works on desktop and mobile
- Loads in < 2 seconds
- Calculation takes < 100ms

**Post-MVP Success:**
- People actually use it while playing Balatro
- Gets shared in Balatro Discord
- Users request new features
- No major bugs reported

## What We're NOT Building

### Never Add These
- User accounts
- Database
- Admin panel
- Payment system
- Social features
- Machine learning
- Blockchain integration

### Probably Not Adding These
- Desktop app
- Native mobile app
- Browser extension
- API for third parties
- Webhook integrations
- Email notifications

## Decision Framework

Before adding any feature, ask:
1. **Did a user request it?** (If no, don't build)
2. **Does it solve a real problem?** (Not just "nice to have")
3. **Is it simple to implement?** (< 1 day of work)
4. **Will it slow down the core use case?** (If yes, don't build)

All four must be favorable to proceed.

## Summary

**Build fast, launch early, iterate based on real usage.**

- Keep it simple
- Use boring technology
- Don't abstract early
- Don't optimize early
- Don't add unused features
- Test manually for MVP
- Deploy when it works
- Add complexity only when proven necessary
