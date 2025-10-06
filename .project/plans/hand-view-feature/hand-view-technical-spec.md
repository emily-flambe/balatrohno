# Hand View Technical Specification

## State Management

### Card Location Tracking
```typescript
type CardLocation = 'deck' | 'hand' | 'discarded';

interface CardState {
  id: string; // e.g., "AH" for Ace of Hearts
  location: CardLocation;
}
```

### Component State
```typescript
// In App.tsx or dedicated component
const [cardStates, setCardStates] = useState<Map<string, CardLocation>>(
  // Initialize all cards in deck
  new Map(allCards.map(card => [card.id, 'deck']))
);
```

## Data Flow

```
Deck Component → Click Handler → Update State → Re-render All Components
Hand Component → Click Handler → Update State → Re-render All Components
```

## Component Structure

### Existing Components to Modify
- **App.tsx**: Add hand state management
- **DeckDisplay.tsx**: Update to show only deck cards
- **CardButton.tsx**: Add location-aware click handlers

### New Components to Create
- **HandDisplay.tsx**: Display cards in hand
- **DiscardPile.tsx**: Show count of discarded cards (optional for MVP)

## State Update Functions

```typescript
const moveCardToHand = (cardId: string) => {
  setCardStates(prev => new Map(prev).set(cardId, 'hand'));
};

const returnCardToDeck = (cardId: string) => {
  setCardStates(prev => new Map(prev).set(cardId, 'deck'));
};

const discardCard = (cardId: string) => {
  setCardStates(prev => new Map(prev).set(cardId, 'discarded'));
};
```

## Probability Calculation Updates

Current calculation uses:
- `deck`: All cards currently in deck
- `drawCount`: Number to draw

Updated calculation needs:
- `availableDeck`: Cards in deck (not in hand or discarded)
- `drawCount`: Still number to draw from available deck

```typescript
const availableDeck = Array.from(cardStates.entries())
  .filter(([_, location]) => location === 'deck')
  .map(([id]) => id);
```

## Performance Considerations

### Avoid
- Deep object cloning
- Unnecessary re-renders
- Complex state derivations

### Prefer
- Map for O(1) lookups
- Simple state updates
- Memoization only if performance issues arise

## Testing Approach

### Manual Testing Checklist
- [ ] Can move card from deck to hand
- [ ] Can return card from hand to deck
- [ ] Can discard card from hand
- [ ] Deck display updates correctly
- [ ] Hand display updates correctly
- [ ] Probability calculations use correct deck
- [ ] No console errors
- [ ] Mobile touch works

## Migration Strategy

1. Add card state management alongside existing deck state
2. Update DeckDisplay to filter based on location
3. Add HandDisplay component
4. Update probability calculations
5. Remove old deck state once new system works

## Error Handling

- Invalid card ID: Log and ignore
- State inconsistency: Log warning, continue
- No error modals or user-facing error messages (keep it simple)