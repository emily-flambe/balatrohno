# Post-MVP Enhancement Phases

Future improvements to add only if users request them.

## Phase 3: Quality of Life

Add these **only if users request them**.

### Deck Templates
**Feature:** Quick "reset to standard" button

**Implementation:**
```typescript
const templates = {
  standard: createStandardDeck(),
  // Add more templates as requested
}

function resetToTemplate(template: keyof typeof templates) {
  setDeck(templates[template])
}
```

**User Request Required:** "I want to quickly reset my deck"

### Recent Queries
**Feature:** Show last 3-5 calculations

**Implementation:**
```typescript
const [history, setHistory] = useState<CalculationResult[]>([])

function addToHistory(result: CalculationResult) {
  setHistory(prev => [result, ...prev].slice(0, 5))
}
```

**User Request Required:** "I want to see my previous calculations"

### Keyboard Shortcuts
**Feature:** Number keys for quick input

**Implementation:**
```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') {
      // Handle number input
    }
  }

  window.addEventListener('keypress', handleKeyPress)
  return () => window.removeEventListener('keypress', handleKeyPress)
}, [])
```

**User Request Required:** "I want keyboard shortcuts for faster input"

### URL Sharing
**Feature:** Share specific deck state via URL

**Implementation:**
```typescript
function encodeState(deck: Card[]): string {
  return btoa(JSON.stringify(deck))
}

function loadFromURL() {
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('deck')
  if (encoded) {
    const deck = JSON.parse(atob(encoded))
    setDeck(deck)
  }
}
```

**User Request Required:** "I want to share my deck configuration"

### Save/Load Decks
**Feature:** localStorage persistence

**Implementation:**
```typescript
function saveDeck(name: string) {
  const saved = JSON.parse(localStorage.getItem('saved-decks') || '{}')
  saved[name] = deck
  localStorage.setItem('saved-decks', JSON.stringify(saved))
}

function loadDeck(name: string) {
  const saved = JSON.parse(localStorage.getItem('saved-decks') || '{}')
  if (saved[name]) {
    setDeck(saved[name])
  }
}
```

**User Request Required:** "I want to save my deck configurations"

## Phase 4: Balatro-Specific Features

Add Balatro game mechanics **only if there's demand**.

### Joker Cards
**Feature:** Special cards with effects

**Implementation:**
```typescript
interface JokerCard {
  id: string
  name: string
  effect: string
  modifiesProbability: boolean
}

// Would need complex calculation adjustments
```

**Complexity:** High
**User Request Required:** "I want to account for Joker effects"

### Enhanced Cards
**Feature:** Cards with mult, bonus, etc.

**Implementation:**
```typescript
interface EnhancedCard extends Card {
  enhancement?: 'mult' | 'bonus' | 'glass' | 'steel' | 'stone'
}
```

**Complexity:** Medium
**User Request Required:** "I want to track card enhancements"

### Planet Cards
**Feature:** Hand type upgrades

**Complexity:** High
**User Request Required:** "I want to account for planet card upgrades"

### Tarot Cards
**Feature:** Card modifications

**Complexity:** High
**User Request Required:** "I want to simulate tarot card effects"

### Expected Value Calculations
**Feature:** Calculate expected scoring value

**Implementation:**
```typescript
function calculateExpectedValue(
  deck: Card[],
  drawCount: number,
  scoringRules: ScoringRules
): number {
  // Complex probability distribution across all possible hands
  // Multiply by hand scores
}
```

**Complexity:** Very High
**User Request Required:** "I want to know expected scoring value"

## Phase 5: Advanced Features

Build these **only if the tool becomes popular**.

### Compare Deck Configurations
**Feature:** Side-by-side probability comparison

**Implementation:**
```typescript
interface DeckComparison {
  deck1: Card[]
  deck2: Card[]
  query: CalculationRequest
  results: {
    deck1: number
    deck2: number
    difference: number
  }
}
```

**Complexity:** Medium
**User Request Required:** "I want to compare different deck setups"

### Probability Distribution Charts
**Feature:** Visual probability distribution

**Implementation:**
```typescript
// Would need charting library (Chart.js, Recharts)
// Adds significant bundle size
```

**Complexity:** Medium
**User Request Required:** "I want to see probability distributions"

### Optimal Deck Suggestions
**Feature:** Recommend deck modifications

**Implementation:**
```typescript
// Would need optimization algorithm
// Complex calculation across many deck states
```

**Complexity:** Very High
**User Request Required:** "I want suggestions for optimal deck composition"

### Balatro Mod Integration
**Feature:** Import deck from Balatro mods

**Complexity:** Very High
**User Request Required:** "I want to import my deck from the game"

### Mobile App (PWA)
**Feature:** Installable progressive web app

**Implementation:**
```javascript
// Add service worker
// Add manifest.json
// Add offline support
```

**Complexity:** Medium
**User Request Required:** "I want to install this as an app"

## Evaluation Criteria

Before implementing any post-MVP feature:

### 1. User Demand
- How many users requested it?
- Is it a critical pain point?
- Would users pay for it?

### 2. Complexity Assessment
- Implementation difficulty: Low/Medium/High/Very High
- Maintenance burden
- Testing requirements
- Bundle size impact

### 3. Impact Analysis
- Will it slow down core use case?
- Does it add confusion?
- Does it add dependencies?
- Does it require database/backend changes?

### 4. Priority Scoring
Score each criterion 1-5, multiply, prioritize highest scores:

```
Priority Score = User Demand × (6 - Complexity) × Impact
```

## Implementation Guidelines

### When Adding Phase 3 Features
1. Get explicit user requests (3+ users minimum)
2. Keep implementation simple
3. Don't slow down core functionality
4. Test thoroughly before shipping

### When Adding Phase 4 Features
1. Get significant user demand (10+ users)
2. Research Balatro mechanics thoroughly
3. Consider complexity vs. benefit
4. May require architectural changes

### When Adding Phase 5 Features
1. Tool must be widely used
2. Strong evidence of need
3. Resources available for maintenance
4. Clear value proposition

## What Never to Add

### Absolutely Never
- User accounts with authentication
- Database for user data
- Payment processing
- Social features (comments, likes, etc.)
- Machine learning
- Blockchain or crypto integration
- NFTs

### Almost Certainly Never
- Desktop application
- Native mobile apps (iOS/Android)
- Browser extensions
- Public API for third-party integrations
- Webhook system
- Email notifications
- SMS notifications

## Success Metrics for Post-MVP

### Phase 3 Success
- Users actively request these features
- Features are actually used (track usage)
- No performance degradation
- No increase in support burden

### Phase 4 Success
- Balatro-specific features are accurate
- Users report improved decision-making
- No confusion about how to use
- Calculations remain fast

### Phase 5 Success
- Advanced features provide clear value
- Sufficient user base to justify complexity
- Positive user feedback
- Tool becomes essential for community

## Summary

**Don't build features users haven't requested.**

**Don't optimize until you have evidence of problems.**

**Don't add complexity without proven need.**

Wait for users to tell you what they need. Build based on actual demand, not assumptions.
