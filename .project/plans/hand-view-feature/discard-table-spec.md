# Discard Probability Table Specification

## Purpose
Show probability of drawing specific cards based on number of discards, helping players decide which cards to discard.

## Table Structure

### Columns
- **N**: Number of cards drawn after discard (1 to number of cards selected for discard)
- Shows probability for drawing exactly N cards

### Rows (in order)
1. **Suit Groups** (4 rows)
   - Any Heart
   - Any Diamond
   - Any Club
   - Any Spade

2. **Rank Groups** (13 rows)
   - Any Ace
   - Any 2
   - Any 3
   - ... through King

3. **Specific Cards** (52 rows)
   - Every individual card (AH, 2H, 3H... KS)
   - Organized by suit, then rank

### Example Table (3 cards selected for discard)
```
┌─────────────┬────────┬────────┬────────┐
│ Card        │ N=1    │ N=2    │ N=3    │
├─────────────┼────────┼────────┼────────┤
│ Any Heart   │ 25.0%  │ 43.8%  │ 58.8%  │
│ Any Diamond │ 25.0%  │ 43.8%  │ 58.8%  │
│ Any Club    │ 25.0%  │ 43.8%  │ 58.8%  │
│ Any Spade   │ 25.0%  │ 43.8%  │ 58.8%  │
├─────────────┼────────┼────────┼────────┤
│ Any Ace     │ 7.8%   │ 15.1%  │ 22.0%  │
│ Any 2       │ 7.8%   │ 15.1%  │ 22.0%  │
│ ...         │ ...    │ ...    │ ...    │
├─────────────┼────────┼────────┼────────┤
│ [Expandable Section: Specific Cards]    │
│ Ace Hearts  │ 2.0%   │ 3.9%   │ 5.8%   │
│ 2 Hearts    │ 2.0%   │ 3.9%   │ 5.8%   │
│ ...         │ ...    │ ...    │ ...    │
└─────────────┴────────┴────────┴────────┘
```

## Calculations

### For Each Cell
Calculate: P(drawing at least 1 of target card type in N draws)

**Inputs**:
- Remaining deck (deck minus hand minus already discarded)
- Number of target cards in remaining deck
- N (number of draws)

**Formula**:
Use existing hypergeometric calculation with:
- deck_size = cards in remaining deck
- matching_cards = target cards in remaining deck
- draw_count = N
- min_matches = 1

### Dynamic Updates
- Recalculate when cards selected for discard change
- Account for cards already in hand (can't be drawn)
- Account for cards already discarded (can't be drawn)

## UI Design

### Expandable Sections
1. **Always Visible**: Suit groups (4 rows) and Rank groups (13 rows)
2. **Collapsible**: Specific cards section (52 rows)
   - Collapsed by default
   - Click to expand
   - "Show all cards" / "Hide specific cards" toggle

### Visual Design
- **Header Row**: Sticky header with N values
- **Row Groups**: Visual separation between suit/rank/specific sections
- **Highlighting**: Highlight rows on hover
- **Percentages**: Show as "XX.X%" format
- **Colors**: Optional color coding (red for low %, green for high %)

### Responsive Design
- **Desktop**: Full table visible
- **Mobile**: Horizontal scroll for columns
- **Alternative**: Card selector + single column view on mobile

## Performance Considerations

### Optimization Strategies
- Calculate only visible rows when collapsed
- Memoize calculations that don't change
- Debounce updates during card selection
- Use virtualization if performance issues (unlikely for ~70 rows)

### Update Triggers
- Card selected/deselected for discard
- Card moved to/from hand
- Card discarded

## Implementation Priority

### Phase 1 (MVP)
- Basic table with all rows visible
- No collapsing
- Simple styling
- Desktop-focused

### Phase 2 (Enhancement)
- Collapsible sections
- Better mobile experience
- Visual improvements
- Performance optimizations if needed

## Validation

### Test Scenarios
1. **No cards selected**: Table should be hidden or show message
2. **1 card selected**: Single N=1 column
3. **5 cards selected**: Five columns N=1 through N=5
4. **Cards in hand**: Verify they're excluded from calculations
5. **Already discarded**: Verify they're excluded from calculations

### Edge Cases
- All hearts in hand (Any Heart shows 0%)
- No aces in deck (Any Ace shows 0%)
- Maximum discard (deck empty scenarios)