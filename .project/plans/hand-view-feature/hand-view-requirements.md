# Hand View Feature Requirements

## User Story
As a Balatro player, I want to simulate my current hand and potential discards to calculate the probability of drawing specific cards, so I can make optimal gameplay decisions.

## Core Requirements

### Hand Area
- Display area above the deck for the player's hand
- Initially empty (all cards in deck)
- Visual distinction between deck and hand areas
- Clear labeling of each area

### Card Movement
1. **Deck to Hand**: Click card in deck to move to hand
2. **Hand to Deck**: Click card in hand with "Return to Deck" option
3. **Hand to Discard**: Click card in hand with "Discard" option
4. **Visual Feedback**: Clear indication of card state and available actions

### Card States
- **In Deck**: Available for selection to hand
- **In Hand**: Can return to deck or discard
- **Discarded**: Removed from play (affects probability calculations)

## User Flow

1. Player starts with full deck (52 cards), empty hand
2. Player clicks cards in deck to build their hand (typically 5-8 cards)
3. Player can rearrange by returning cards to deck
4. Player selects cards to discard
5. System calculates probabilities based on remaining deck

## Constraints

### Performance
- Card movements must be instant (no animation delays during gameplay)
- State updates must not cause lag

### Usability
- Mobile-friendly touch targets
- Clear visual hierarchy
- Intuitive interactions without instructions needed

### Simplicity
- No drag-and-drop (click-based interactions only)
- No undo/redo (direct manipulation only)
- No card animations (instant state changes)

## Out of Scope (MVP)

- Hand size limits (player manages manually)
- Joker cards or special cards
- Hand evaluation (poker hands)
- Draw simulation
- Save/load hand configurations

## Success Criteria

1. Player can build a hand from the deck
2. Player can return cards from hand to deck
3. Player can discard cards from hand
4. All interactions are fast and responsive
5. State is consistent and predictable