# Hand View UI Specification

## Layout Structure

```
┌─────────────────────────────────────┐
│           HAND AREA                  │
│   [Empty initially]                  │
│   [Cards appear here when selected]  │
├─────────────────────────────────────┤
│           DECK AREA                  │
│   [52 cards initially]               │
│   [Cards removed when in hand]       │
├─────────────────────────────────────┤
│      PROBABILITY CALCULATOR          │
│   [Existing calculator]              │
└─────────────────────────────────────┘
```

## Visual Design

### Hand Area
- **Background**: Slightly different shade to distinguish from deck
- **Border**: Subtle border or divider line
- **Label**: "Your Hand" text
- **Empty State**: "Click cards in deck to build your hand"
- **Height**: Fixed height to prevent layout shift

### Card Display in Hand
- **Layout**: Horizontal row, wrapping if needed
- **Spacing**: Consistent gap between cards
- **Interaction**: Click to show action menu

### Action Menu (Hand Cards)
- Simple two-button overlay or dropdown:
  - "Return to Deck"
  - "Discard"
- Appears on click, dismisses on action or click away

### Deck Area Updates
- **Removed Cards**: Simply don't display (no placeholder)
- **Layout**: Existing grid layout maintained
- **Visual Feedback**: No special styling for removed cards

### Discard Indicator (Optional for MVP)
- Small counter: "Discarded: 3"
- Located near hand area
- No need to show actual discarded cards

## Responsive Design

### Desktop (>768px)
- Hand cards in single row
- Deck in existing multi-row grid
- Action menu as dropdown

### Mobile (<768px)
- Hand cards wrap to multiple rows
- Smaller card buttons
- Action menu as modal overlay
- Larger touch targets (44px minimum)

## Component Classes (Tailwind)

### Hand Area Container
```css
border-t border-gray-200
bg-gray-50
p-4
min-h-[120px]
```

### Hand Card Button
```css
px-3 py-2
bg-white
border border-gray-300
rounded
hover:bg-gray-100
active:bg-gray-200
```

### Action Menu
```css
absolute
bg-white
border border-gray-300
rounded
shadow-md
z-10
```

## Interaction States

### Card in Deck
- **Default**: Normal appearance
- **Hover**: Slight highlight
- **Click**: Move to hand immediately

### Card in Hand
- **Default**: Normal appearance
- **Hover**: Slight highlight
- **Click**: Show action menu
- **Selected**: Border highlight while menu open

### Discarded Card
- Not visible in UI (removed from play)

## Accessibility

- **Keyboard Navigation**: Tab through cards, Enter to select
- **ARIA Labels**: Descriptive labels for screen readers
- **Focus Indicators**: Clear focus outlines
- **Touch Targets**: Minimum 44px on mobile

## Implementation Notes

- Use existing CardButton component where possible
- Keep styling consistent with current design
- No animations or transitions (instant feedback)
- Avoid layout shift when cards move between areas