# Hand View Implementation Tasks

## Pre-Implementation Review
- [ ] Read all planning documents in order
- [ ] Review existing App.tsx structure
- [ ] Review existing DeckDisplay component
- [ ] Review existing CardButton component
- [ ] Understand current state management

## Phase 1: State Management Setup

### Task 1.1: Add Card Location State
```typescript
// In App.tsx
type CardLocation = 'deck' | 'hand' | 'discarded';
const [cardLocations, setCardLocations] = useState<Map<string, CardLocation>>();
```
- [ ] Define CardLocation type
- [ ] Create state map initialized with all cards in 'deck'
- [ ] Verify state initializes correctly

### Task 1.2: Create State Update Functions
- [ ] Implement `moveCardToHand(cardId: string)`
- [ ] Implement `returnCardToDeck(cardId: string)`
- [ ] Implement `discardCard(cardId: string)`
- [ ] Test each function with console.log

## Phase 2: Hand Display Component

### Task 2.1: Create HandDisplay Component
Location: `src/components/HandDisplay.tsx`
- [ ] Create component file
- [ ] Accept props: cards, onCardClick
- [ ] Display cards in horizontal layout
- [ ] Add "Your Hand" label
- [ ] Show empty state when no cards

### Task 2.2: Integrate HandDisplay into App
- [ ] Import HandDisplay in App.tsx
- [ ] Place above DeckDisplay
- [ ] Pass filtered hand cards
- [ ] Connect click handlers

## Phase 3: Update Deck Display

### Task 3.1: Filter Deck Cards
- [ ] Update DeckDisplay to only show cards with location='deck'
- [ ] Maintain existing grid layout
- [ ] Ensure removed cards don't leave gaps

### Task 3.2: Update Click Behavior
- [ ] Clicking deck card moves to hand
- [ ] Remove any existing toggle behavior
- [ ] Verify cards disappear from deck when moved

## Phase 4: Hand Card Interactions

### Task 4.1: Create Action Menu Component
Location: `src/components/CardActionMenu.tsx`
- [ ] Create simple menu with two buttons
- [ ] "Return to Deck" button
- [ ] "Discard" button
- [ ] Position absolutely near clicked card
- [ ] Dismiss on action or outside click

### Task 4.2: Integrate Action Menu
- [ ] Add menu state to track which card is selected
- [ ] Show menu on hand card click
- [ ] Connect menu actions to state updates
- [ ] Test both actions work correctly

## Phase 5: Update Probability Calculations

### Task 5.1: Filter Available Deck
- [ ] Update deck filter to exclude hand and discarded cards
- [ ] Pass filtered deck to probability calculator
- [ ] Verify calculations use correct card count

### Task 5.2: Update UI Labels
- [ ] Show "Cards in Deck: X" count
- [ ] Show "Cards in Hand: Y" count
- [ ] Show "Discarded: Z" count (optional)

## Phase 6: Mobile Optimization

### Task 6.1: Responsive Layout
- [ ] Test on mobile viewport
- [ ] Ensure touch targets are 44px minimum
- [ ] Verify hand cards wrap appropriately
- [ ] Check action menu works on mobile

### Task 6.2: Touch Interactions
- [ ] Test all clicks work as taps
- [ ] Verify no hover-dependent features
- [ ] Ensure menu dismisses properly

## Phase 7: Final Verification

### Task 7.1: Functionality Testing
- [ ] Build hand of 5-8 cards
- [ ] Return cards to deck
- [ ] Discard cards
- [ ] Verify probability updates correctly
- [ ] Test edge cases (empty hand, all cards in hand)

### Task 7.2: Code Quality
- [ ] Run `npm run lint` - fix any errors
- [ ] Run `npm run type-check` - fix any errors
- [ ] Run `npm run build` - ensure builds
- [ ] Check console for any errors
- [ ] Verify no emojis in code or UI

### Task 7.3: Clean Up
- [ ] Remove console.log statements
- [ ] Remove commented code
- [ ] Ensure consistent code style
- [ ] Add brief comments where needed

## Common Pitfalls to Avoid

1. **Don't overcomplicate state** - Map is fine, no Redux needed
2. **Don't add animations** - Keep interactions instant
3. **Don't add features not in spec** - No undo, no hand limits
4. **Don't optimize prematurely** - Get it working first
5. **Don't forget mobile** - Test on small viewport

## Definition of Done

- [ ] All tasks checked off
- [ ] Manual testing passes all scenarios
- [ ] No console errors
- [ ] Build succeeds
- [ ] Lint passes
- [ ] Type check passes
- [ ] Code follows project principles