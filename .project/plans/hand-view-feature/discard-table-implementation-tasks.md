# Discard Probability Table Implementation Tasks

## Prerequisites
- [ ] Complete Phase 1: Core Hand Management
- [ ] Verify discard functionality works
- [ ] Review discard-table-spec.md

## Phase 1: Data Structure Setup

### Task 1.1: Define Table Data Types
```typescript
interface TableRow {
  cardType: string; // "Any Heart", "Any Ace", "AH"
  category: 'suit' | 'rank' | 'specific';
  probabilities: number[]; // Index corresponds to N-1
}
```
- [ ] Define TypeScript interfaces
- [ ] Create row generator function
- [ ] Create test data structure

### Task 1.2: Create Row Definitions
- [ ] Generate 4 suit rows
- [ ] Generate 13 rank rows
- [ ] Generate 52 specific card rows
- [ ] Verify total of 69 rows

## Phase 2: Calculation Logic

### Task 2.1: Create Calculation Function
Location: `src/utils/discardProbabilities.ts`
```typescript
function calculateDiscardProbabilities(
  remainingDeck: string[],
  selectedForDiscard: string[],
  cardType: string
): number[]
```
- [ ] Implement function signature
- [ ] Calculate for each N value
- [ ] Handle "Any" types (suit/rank)
- [ ] Handle specific cards

### Task 2.2: Integrate with Existing Calculator
- [ ] Reuse hypergeometric calculation
- [ ] Filter remaining deck correctly
- [ ] Account for cards in hand
- [ ] Account for already discarded

## Phase 3: Table Component

### Task 3.1: Create DiscardTable Component
Location: `src/components/DiscardTable.tsx`
- [ ] Create component structure
- [ ] Accept props: selectedForDiscard, cardLocations
- [ ] Generate table rows
- [ ] Display probabilities as percentages

### Task 3.2: Table Layout
- [ ] Create table with sticky header
- [ ] N columns based on discard count
- [ ] Group rows by category
- [ ] Add visual separators between groups

## Phase 4: Selection Integration

### Task 4.1: Track Selected for Discard
- [ ] Add state for selected cards in hand
- [ ] Multi-select checkbox/toggle on hand cards
- [ ] Visual indicator for selected cards
- [ ] Select/deselect all button (optional)

### Task 4.2: Connect to Table
- [ ] Pass selected cards to table
- [ ] Update table when selection changes
- [ ] Hide table when no cards selected
- [ ] Show "Select cards to discard" message

## Phase 5: MVP Optimization

### Task 5.1: Basic Performance
- [ ] Calculate only when selection changes
- [ ] Avoid unnecessary re-renders
- [ ] Test with maximum selections

### Task 5.2: Responsive Design
- [ ] Test on mobile viewport
- [ ] Add horizontal scroll if needed
- [ ] Ensure readable on small screens

## Phase 6: Visual Polish (MVP Level)

### Task 6.1: Basic Styling
- [ ] Consistent with existing design
- [ ] Clear row groups
- [ ] Readable percentages
- [ ] No emojis or decorative elements

### Task 6.2: User Feedback
- [ ] Loading state if calculations slow (unlikely)
- [ ] Clear "no selection" state
- [ ] Proper spacing and alignment

## Phase 7: Testing

### Task 7.1: Calculation Verification
- [ ] Test with 1 card selected
- [ ] Test with 5 cards selected
- [ ] Test with cards in hand affecting results
- [ ] Verify percentages are reasonable

### Task 7.2: Edge Cases
- [ ] No cards in deck scenario
- [ ] All of a type in hand/discarded
- [ ] Maximum possible discards

### Task 7.3: Integration Testing
- [ ] Full flow: deck → hand → select → table
- [ ] Verify all states update correctly
- [ ] Check for memory leaks or performance issues

## Phase 8: Final Verification

### Task 8.1: Code Quality
- [ ] Run `npm run lint` - fix errors
- [ ] Run `npm run type-check` - fix errors
- [ ] Run `npm run build` - ensure builds
- [ ] Remove console.log statements

### Task 8.2: Documentation
- [ ] Add comments for complex calculations
- [ ] Update README if needed
- [ ] Document any limitations

## Future Enhancements (Not MVP)

Document but don't implement:
- Collapsible specific cards section
- Color coding for probabilities
- Sort by probability
- Export table data
- Save/load selections
- Comparison mode (multiple discard scenarios)

## Definition of Done

- [ ] Table displays correct probabilities
- [ ] Updates dynamically with selection
- [ ] No performance issues
- [ ] Works on desktop and mobile
- [ ] All quality checks pass
- [ ] Follows project simplicity principles

## Common Mistakes to Avoid

1. **Don't add collapse feature** - Not needed for MVP
2. **Don't color code** - Keep it simple
3. **Don't optimize prematurely** - 69 rows is fine
4. **Don't add features** - Stick to spec
5. **Don't forget mobile** - Must be usable