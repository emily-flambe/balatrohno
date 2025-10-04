# Phase 1: Core Functionality - Implementation Tasks

**Start here first.** Complete all tasks in this file before moving to Phase 2.

**Reference:** See `mvp-core-functionality.md` for technical specifications.

## Prerequisites

Before starting:
- [ ] Node.js 20+ installed
- [ ] Python 3.11+ installed
- [ ] npm 10+ installed
- [ ] Code editor set up

## Step 1: Project Setup

Complete in order:

### 1.1 Initialize Project
- [ ] Create project directory structure
- [ ] Initialize npm project: `npm init -y`
- [ ] Install Vite and React: `npm install react react-dom`
- [ ] Install dev dependencies: `npm install -D @vitejs/plugin-react typescript @types/react @types/react-dom vite`
- [ ] Install Tailwind CSS: `npm install -D tailwindcss@next postcss autoprefixer`
- [ ] Create `tsconfig.json` (copy from `setup.md`)
- [ ] Create `vite.config.ts` (copy from `setup.md`)
- [ ] Create `tailwind.config.js`

### 1.2 Python Setup
- [ ] Create `python/` directory
- [ ] Create `python/requirements.txt` with scipy
- [ ] Install Python dependencies: `pip install -r python/requirements.txt`
- [ ] Verify scipy: `python3 -c "import scipy; print(scipy.__version__)"`

### 1.3 Cloudflare Workers Setup
- [ ] Install wrangler: `npm install -g wrangler`
- [ ] Create `worker/` directory
- [ ] Create `wrangler.toml` (copy from `setup.md`)
- [ ] Authenticate: `wrangler login`

### 1.4 Verify Setup
- [ ] Run `npm run dev` successfully
- [ ] Run `wrangler dev worker/index.py` successfully
- [ ] Both servers start without errors

**Checkpoint:** You should have two servers running locally.

---

## Step 2: Data Types

Complete in order:

### 2.1 Create Type Definitions
- [ ] Create `src/lib/types.ts`
- [ ] Define `Rank` type (all 13 ranks)
- [ ] Define `Suit` type (hearts, diamonds, clubs, spades)
- [ ] Define `Card` interface (id, rank, suit)
- [ ] Define `CalculationRequest` interface
- [ ] Define `CalculationResponse` interface

### 2.2 Create Deck Utilities
- [ ] Create `src/lib/deck.ts`
- [ ] Implement `createStandardDeck()` function (returns 52 cards)
- [ ] Test function returns correct number of cards
- [ ] Test function includes all ranks and suits

**Checkpoint:** TypeScript types compile without errors.

---

## Step 3: Backend - Python Calculation

Complete in order:

### 3.1 Create Calculation Function
- [ ] Create `python/calculate.py`
- [ ] Import scipy.stats.hypergeom
- [ ] Implement `calculate_probability(deck_size, matching_cards, draw_count, min_matches)`
- [ ] Handle min_matches == 1 case (use pmf)
- [ ] Handle min_matches > 1 case (use cdf)

### 3.2 Create Validation Function
- [ ] Implement `validate_inputs()` function
- [ ] Check deck_size >= 1
- [ ] Check matching_cards <= deck_size
- [ ] Check draw_count <= deck_size
- [ ] Check min_matches <= draw_count
- [ ] Return clear error messages

### 3.3 Test Calculations Manually
- [ ] Test: at least 1 Ace in 5 cards from 52 (should be ~34.1%)
- [ ] Test: impossible scenario (5 Aces from 4) returns 0
- [ ] Test: certain scenario (at least 0 matches) returns 1.0
- [ ] Test: validation catches invalid inputs

**Checkpoint:** Python calculation function works correctly.

---

## Step 4: Backend - Cloudflare Worker

Complete in order:

### 4.1 Create Worker Handler
- [ ] Create `worker/index.py`
- [ ] Import calculation functions
- [ ] Create request handler for POST /api/calculate
- [ ] Parse JSON request body
- [ ] Validate inputs
- [ ] Call calculation function
- [ ] Return JSON response with probability

### 4.2 Add Error Handling
- [ ] Catch validation errors, return 400 with message
- [ ] Catch calculation errors, return 500
- [ ] Catch JSON parse errors, return 400
- [ ] Handle missing required fields

### 4.3 Test Worker Locally
- [ ] Start worker: `wrangler dev worker/index.py`
- [ ] Test with curl or Postman
- [ ] Verify calculation returns correct result
- [ ] Verify validation returns appropriate errors
- [ ] Check worker logs for issues

**Checkpoint:** Worker responds to API calls correctly.

---

## Step 5: Frontend - Basic React App

Complete in order:

### 5.1 Create App Structure
- [ ] Create `src/main.tsx` (React entry point)
- [ ] Create `src/App.tsx` (main component)
- [ ] Create `src/index.css` (Tailwind directives)
- [ ] Create `public/` directory for static assets
- [ ] Test app renders "Hello World"

### 5.2 Create useDeck Hook
- [ ] Create `src/hooks/useDeck.ts`
- [ ] Initialize with `createStandardDeck()`
- [ ] Implement `addCard(card)` function
- [ ] Implement `removeCard(id)` function
- [ ] Return deck array and functions

**Checkpoint:** Basic React app renders successfully.

---

## Step 6: Frontend - Deck Display

Complete in order:

### 6.1 Create Card Component
- [ ] Create `src/components/Card.tsx`
- [ ] Accept props: `card`, `onRemove`
- [ ] Display rank and suit
- [ ] Add click handler for removal
- [ ] Style with Tailwind (basic styling for now)

### 6.2 Create DeckDisplay Component
- [ ] Create `src/components/DeckDisplay.tsx`
- [ ] Accept props: `deck`, `onRemoveCard`
- [ ] Map over deck array
- [ ] Render Card component for each
- [ ] Display total count
- [ ] Use grid layout (responsive)

### 6.3 Integrate into App
- [ ] Import DeckDisplay in App.tsx
- [ ] Pass deck from useDeck
- [ ] Pass removeCard handler
- [ ] Verify 52 cards display
- [ ] Test clicking card removes it
- [ ] Test count updates correctly

**Checkpoint:** Can see and remove cards.

---

## Step 7: Frontend - Deck Controls

Complete in order:

### 7.1 Create DeckControls Component
- [ ] Create `src/components/DeckControls.tsx`
- [ ] Add rank dropdown (all 13 ranks)
- [ ] Add suit dropdown (all 4 suits)
- [ ] Add "Add Card" button
- [ ] useState for rank and suit
- [ ] Style with Tailwind

### 7.2 Integrate into App
- [ ] Import DeckControls in App.tsx
- [ ] Pass addCard handler from useDeck
- [ ] Verify dropdowns work
- [ ] Test adding card increases count
- [ ] Test added card appears in display

**Checkpoint:** Can add and remove cards.

---

## Step 8: Frontend - Calculator

Complete in order:

### 8.1 Create Calculator Component
- [ ] Create `src/components/Calculator.tsx`
- [ ] Add draw count input (number)
- [ ] Add min matches input (number)
- [ ] Add search type dropdown (rank, suit, color)
- [ ] Add search value dropdown (dynamic based on type)
- [ ] Add "Calculate" button
- [ ] useState for all inputs

### 8.2 Add Result Display
- [ ] Add result state
- [ ] Add loading state
- [ ] Display probability as percentage
- [ ] Display what was calculated (explanation)
- [ ] Style result clearly

**Checkpoint:** Calculator UI is complete (no API call yet).

---

## Step 9: API Integration

Complete in order:

### 9.1 Create API Client
- [ ] Create `src/lib/api.ts`
- [ ] Implement `calculateProbability(request)` function
- [ ] Use fetch to POST to /api/calculate
- [ ] Handle response
- [ ] Handle errors
- [ ] Return probability

### 9.2 Connect Calculator to API
- [ ] Import API client in Calculator
- [ ] Call API on button click
- [ ] Set loading state during call
- [ ] Display result on success
- [ ] Display error on failure
- [ ] Add error state management

### 9.3 Test End-to-End
- [ ] Enter query: at least 1 Ace in 5 cards
- [ ] Click Calculate
- [ ] Verify result is ~34.1%
- [ ] Test with different queries
- [ ] Test with invalid inputs
- [ ] Verify errors display correctly

**Checkpoint:** Complete end-to-end workflow works.

---

## Step 10: Validation

Complete in order:

### 10.1 Add Input Validation
- [ ] Validate draw count <= deck size
- [ ] Validate min matches <= draw count
- [ ] Validate min matches >= 0
- [ ] Disable Calculate button when invalid
- [ ] Show validation errors inline

### 10.2 Test All Edge Cases
- [ ] Test: draw more cards than deck has
- [ ] Test: min matches > draw count
- [ ] Test: empty deck
- [ ] Test: negative numbers
- [ ] Test: non-integer inputs
- [ ] Verify all cases handled gracefully

**Checkpoint:** All validation works correctly.

---

## Step 11: Manual Testing

Complete in order:

### 11.1 Desktop Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Check console for errors
- [ ] Verify layout looks correct
- [ ] Test all functionality in each browser

### 11.2 Mobile Testing
- [ ] Open in Chrome DevTools mobile view
- [ ] Test in iPhone simulator or device
- [ ] Test in Android simulator or device
- [ ] Verify touch interactions work
- [ ] Verify text is readable
- [ ] Test in portrait and landscape

### 11.3 Functionality Testing
- [ ] Start with 52 cards
- [ ] Remove 10 cards
- [ ] Add 5 cards back
- [ ] Verify count is 47
- [ ] Calculate probability
- [ ] Verify result makes sense
- [ ] Test 5 different queries
- [ ] Verify all results are reasonable

**Checkpoint:** App works on all platforms.

---

## Phase 1 Complete

Before moving to Phase 2:
- [ ] All checkpoints passed
- [ ] No console errors
- [ ] All core functionality works
- [ ] Tested on desktop and mobile
- [ ] Calculations are accurate

**Next:** Proceed to `todos-phase2-polish.md`
