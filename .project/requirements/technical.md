# Technical Requirements

## Core Technology Stack

### Frontend Framework
- **React** (latest stable version)
  - Modern hooks: `useState`, `useCallback`, `useMemo`, `useEffect`
  - Component composition patterns
  - TypeScript integration
  - Efficient re-rendering with proper memoization

### Build System & Tooling
- **Vite** (latest stable version)
  - Requires Node.js 20+ (LTS recommended)
  - Native ESM with rollup
  - Lightning-fast HMR with instant updates
  - Built-in TypeScript support
  - Optimized production builds with tree-shaking

### Language & Type System
- **TypeScript** (latest stable version)
  - Strict mode configuration
  - Enhanced type inference
  - Latest ECMAScript features support
  - Bundler module resolution
  - Path mapping and absolute imports

### Styling & Design System
- **Tailwind CSS** (latest stable version)
  - Vite plugin integration
  - Card-based UI components
  - Responsive design utilities
  - Custom color palette for Balatro aesthetic
  - Dark theme by default

### Backend Runtime
- **Cloudflare Workers**
  - V8 isolates with Web API compatibility
  - Python integration for calculations
  - Global edge deployment
  - <10ms cold starts

### Calculation Engine
- **Python** (3.11+)
  - scipy for hypergeometric distribution
  - JSON input/output for integration
  - Standalone calculation scripts
  - Error handling and validation

### Testing Framework
- **Vitest** (latest stable version)
  - Native ESM and TypeScript support
  - Fast execution
  - Built-in code coverage
  - Watch mode with intelligent re-runs

- **React Testing Library** (latest stable version)
  - Component testing
  - User-centric test patterns
  - Integration with Vitest

- **Playwright** (optional for E2E)
  - Browser automation
  - Visual regression testing
  - Cross-browser compatibility

### Development Tools
- **ESLint** with flat config
- **Prettier** for code formatting

## Architecture Requirements

### Project Structure
```
balatro-probability-calculator/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Select.tsx
│   │   ├── DeckDisplay.tsx
│   │   ├── CardEditor.tsx
│   │   ├── ProbabilityCalculator.tsx
│   │   └── ResultsDisplay.tsx
│   ├── hooks/
│   │   ├── useDeck.ts
│   │   └── useCalculator.ts
│   ├── lib/
│   │   ├── api/
│   │   │   └── calculator.ts
│   │   ├── types/
│   │   │   └── card.ts
│   │   └── utils/
│   │       └── card-utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── worker/
│   ├── index.ts              # Cloudflare Worker entry point
│   ├── python-integration.ts
│   └── validation.ts
├── python/
│   ├── calculate_probability.py
│   ├── requirements.txt
│   └── README.md
├── public/
├── tests/
│   ├── unit/
│   └── integration/
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── wrangler.toml
└── README.md
```

### Component Architecture
- **Composition over Complexity**: Use React composition patterns
- **Single Responsibility**: Each component has one clear purpose
- **Type-Safe Props**: All component props fully typed
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Memoization for expensive operations

### State Management
- **React Built-ins**: `useState`, `useReducer` for local state
- **Custom Hooks**: `useDeck` for deck management, `useCalculator` for calculation state
- **No Global State Library**: Keep state local and simple
- **Props Drilling**: Acceptable for shallow component trees

## Performance Requirements

### Build Performance
- **Development Start**: <3 seconds from `npm run dev`
- **Hot Module Replacement**: <100ms for component updates
- **Production Build**: <30 seconds for full build
- **Bundle Size**: <500KB initial bundle (gzipped)

### Runtime Performance
- **Initial Load**: <2 seconds on 3G network
- **Calculation Response**: <100ms for any deck size up to 200 cards
- **UI Interactions**: 60fps smooth animations
- **Memory Usage**: <50MB for entire application

### Optimization Strategies
- **Code Splitting**: Route-based lazy loading (if multi-page)
- **Component Memoization**: React.memo for expensive components
- **Efficient Re-renders**: Proper dependency arrays in hooks
- **Tailwind Purging**: Remove unused CSS classes

## Data Requirements

### Card Data Structure
```typescript
interface Card {
  rank: CardRank
  suit: CardSuit
}

type CardRank =
  | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | 'Jack' | 'Queen' | 'King' | 'Ace'

type CardSuit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades'
```

### Calculation Request
```typescript
interface CalculationRequest {
  deck: Card[]
  drawCount: number
  atLeastCount: number
  searchType: 'rank' | 'suit' | 'color'
  searchValue: string
}
```

### Calculation Response
```typescript
interface CalculationResponse {
  probability: number          // 0.0 to 1.0
  explanation: string          // Human-readable explanation
  deckSize: number
  matchingCards: number
  drawCount: number
  atLeastCount: number
}
```

### Storage Requirements
- **No Database**: Application is stateless
- **No Persistence**: No save/load in MVP
- **All In-Memory**: Deck state managed in React state

## Security Requirements

### Input Validation
- **Frontend Validation**: Prevent invalid user inputs
- **Backend Validation**: Verify all request parameters
- **Deck Size Limits**: Maximum 1000 cards to prevent abuse
- **Request Rate Limiting**: Prevent calculation abuse (Cloudflare Workers feature)

### Data Protection
- **No Sensitive Data**: Application handles no user credentials
- **HTTPS Only**: Force HTTPS in production
- **CORS Configuration**: Properly configured CORS headers
- **Content Security Policy**: Strict CSP headers

### Code Security
- **Dependency Scanning**: Regular npm audit
- **No Secrets in Code**: No API keys or secrets (none needed)
- **TypeScript Strict Mode**: Catch potential errors at compile time
- **Input Sanitization**: Validate all user inputs

## Browser Support

### Target Browsers
- **Chrome**: Latest 2 versions (Primary)
- **Firefox**: Latest 2 versions (Should work)
- **Safari**: Latest 2 versions (Should work)
- **Edge**: Latest 2 versions (Should work)

### Feature Requirements
- **ES2022 Support**: Modern JavaScript features
- **Web APIs**: Fetch API, modern DOM APIs
- **CSS Features**: CSS Grid, Flexbox, Custom Properties
- **No IE Support**: Modern browsers only

## Development Environment

### Required Software
- **Node.js**: 20+ (LTS recommended)
- **npm**: 10+ or **pnpm**: Latest
- **Python**: 3.11+ (for calculation engine development)
- **Git**: Modern version
- **VS Code**: Recommended with extensions

### Python Dependencies
```txt
# python/requirements.txt
scipy>=1.11.0
```

### System Requirements
- **RAM**: 8GB minimum
- **Storage**: 2GB free space
- **OS**: macOS, Linux, or Windows
- **Network**: For package downloads and Cloudflare deployment

### VS Code Extensions (Recommended)
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-python.python"
  ]
}
```

## Quality Assurance

### Code Quality Standards
- **TypeScript Strict Mode**: No `any` types, strict null checks
- **ESLint Configuration**: React + TypeScript rules
- **Prettier Integration**: Automatic code formatting
- **Import Organization**: Consistent import ordering

### Testing Requirements
- **Unit Tests**: >80% coverage for utility functions
- **Component Tests**: Key components tested with React Testing Library
- **Calculation Tests**: Python calculation engine 100% tested
- **Edge Cases**: Validation logic fully tested

### Testing Strategy
```typescript
// Example: Testing useDeck hook
describe('useDeck', () => {
  it('initializes with standard 52-card deck', () => {
    const { result } = renderHook(() => useDeck())
    expect(result.current.deck).toHaveLength(52)
  })

  it('adds card to deck', () => {
    const { result } = renderHook(() => useDeck())
    act(() => {
      result.current.addCard({ rank: 'Ace', suit: 'Hearts' })
    })
    expect(result.current.deck).toHaveLength(53)
  })

  it('removes card from deck', () => {
    const { result } = renderHook(() => useDeck())
    act(() => {
      result.current.removeCard(0)
    })
    expect(result.current.deck).toHaveLength(51)
  })
})
```

### Python Testing
```python
# tests/test_calculation.py
import pytest
from calculate_probability import calculate_at_least_probability

def test_impossible_draw():
    # Drawing 5 Aces when only 4 exist
    prob = calculate_at_least_probability(
        population_size=52,
        success_states=4,
        sample_size=5,
        at_least_count=5
    )
    assert prob == 0.0

def test_certain_draw():
    # Drawing at least 0 cards always succeeds
    prob = calculate_at_least_probability(
        population_size=52,
        success_states=4,
        sample_size=5,
        at_least_count=0
    )
    assert prob == 1.0

def test_known_probability():
    # Drawing at least 1 Ace in 5 cards from standard deck
    prob = calculate_at_least_probability(
        population_size=52,
        success_states=4,
        sample_size=5,
        at_least_count=1
    )
    # Known result: approximately 0.341
    assert 0.34 < prob < 0.35
```

## Deployment Requirements

### Cloudflare Workers
- **Account**: Free or paid Cloudflare account
- **Wrangler CLI**: Latest version installed globally
- **Python Runtime**: Cloudflare Workers Python support
- **Configuration**: wrangler.toml properly configured

### Environment Variables
```toml
# wrangler.toml
name = "balatro-probability-calculator"
main = "worker/index.ts"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"
```

### Deployment Commands
```bash
# Development
npm run dev              # Frontend
wrangler dev            # Worker locally

# Production
npm run build           # Build frontend
wrangler deploy         # Deploy to Cloudflare Workers
```

## API Specification

### Endpoints

#### POST /api/calculate
Calculate probability for given deck and parameters.

**Request:**
```json
{
  "deck": [
    { "rank": "Ace", "suit": "Hearts" },
    { "rank": "2", "suit": "Clubs" }
  ],
  "drawCount": 5,
  "atLeastCount": 1,
  "searchType": "rank",
  "searchValue": "Ace"
}
```

**Response (200 OK):**
```json
{
  "probability": 0.341,
  "explanation": "Probability of drawing at least 1 Ace in 5 cards",
  "deckSize": 52,
  "matchingCards": 4,
  "drawCount": 5,
  "atLeastCount": 1
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Cannot draw more cards than deck contains"
}
```

### Error Handling
- **400**: Invalid request parameters
- **500**: Internal server error (Python calculation failure)
- **429**: Rate limit exceeded (Cloudflare automatic)

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 contrast ratio for text
- **Focus Indicators**: Visible focus states for all interactive elements

### Accessibility Features
- **Alt Text**: Descriptive alt text for card suits (if using images)
- **Form Labels**: All inputs properly labeled
- **Error Messages**: Clear, descriptive error messages
- **Skip Links**: Skip to main content link

## Performance Monitoring

### Metrics to Track
- **Bundle Size**: Monitor JavaScript bundle size
- **Load Time**: Track initial page load time
- **Calculation Time**: Monitor API response times
- **Error Rate**: Track failed calculations

### Tools
- **Lighthouse**: Regular Lighthouse audits
- **Vite Bundle Analyzer**: Monitor bundle composition
- **Cloudflare Analytics**: Track worker performance
- **Console Logging**: Development debugging

## Version Management

### Package Management
- **Lock Files**: Committed package-lock.json
- **Exact Versions**: Pin critical dependencies
- **Regular Updates**: Monthly dependency updates
- **Security Patches**: Immediate security updates

### Versioning
- **Semantic Versioning**: Follow semver for releases
- **Git Tags**: Tag releases in git
- **Changelog**: Maintain CHANGELOG.md

This technical specification provides the foundation for building a fast, accurate, and maintainable card probability calculator using modern web technologies.
