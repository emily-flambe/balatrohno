# MVP Polish & Deployment

Technical specification for polishing the MVP and deploying to production.

## Goal

Make the calculator look professional and deploy it for Balatro players to use.

## Requirements

### 1. Balatro-Style Design
- Dark theme matching Balatro's aesthetic
- Card styling similar to game cards
- Smooth transitions and hover effects
- Professional color scheme

**Styling Approach:**
```css
/* Dark theme base */
:root {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --accent: #ff6b35;
}

/* Card styling */
.card {
  background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
  border-radius: 8px;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}
```

### 2. Error Messages
- Clear, helpful error messages
- User-friendly language
- Specific guidance on how to fix

**Error Scenarios:**
- Cannot draw more cards than deck contains
- Minimum matches cannot exceed draw count
- Invalid search criteria
- API call failures
- Network errors

**Implementation:**
```typescript
function getErrorMessage(error: CalculationError): string {
  switch (error.type) {
    case 'INVALID_DRAW_COUNT':
      return `Cannot draw ${error.drawCount} cards from deck of ${error.deckSize}`
    case 'INVALID_MIN_MATCHES':
      return `Minimum matches (${error.minMatches}) cannot exceed draw count (${error.drawCount})`
    case 'NETWORK_ERROR':
      return 'Failed to connect to calculation server. Please try again.'
    default:
      return 'An error occurred. Please check your inputs and try again.'
  }
}
```

### 3. Validation Feedback
- Disable calculate button when inputs invalid
- Show validation errors inline
- Highlight invalid fields
- Prevent invalid states

**Validation Rules:**
- Draw count: 1 to deck size
- Min matches: 0 to draw count
- Search value: must match search type

### 4. Responsive Design
- Mobile-first approach
- Touch-friendly controls (44px minimum)
- Readable text on small screens
- Grid adapts to screen size

**Breakpoints:**
```css
/* Mobile: single column */
@media (max-width: 640px) {
  .deck-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Tablet: 2-column layout */
@media (min-width: 641px) and (max-width: 1024px) {
  .deck-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

/* Desktop: full grid */
@media (min-width: 1025px) {
  .deck-grid {
    grid-template-columns: repeat(13, 1fr);
  }
}
```

### 5. Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**Test Checklist:**
- [ ] Layout renders correctly
- [ ] Cards display properly
- [ ] Forms work
- [ ] API calls succeed
- [ ] No console errors
- [ ] No visual glitches

### 6. Production Build
- Vite production build
- Bundle size optimization
- Asset optimization
- Environment configuration

**Build Steps:**
```bash
# Clean build
rm -rf dist .vite

# Production build
npm run build

# Verify output
ls -lh dist/
```

### 7. Cloudflare Workers Deployment
- Configure wrangler.toml
- Set up Cloudflare account
- Deploy static assets
- Deploy worker with Python

**Deployment:**
```bash
# Authenticate
wrangler login

# Deploy
wrangler deploy

# Verify
curl https://your-worker.workers.dev/api/calculate -X POST \
  -H "Content-Type: application/json" \
  -d '{"deck_size":52,"matching_cards":4,"draw_count":5,"min_matches":1}'
```

## Success Criteria

- [ ] Dark theme looks professional
- [ ] Cards styled like Balatro
- [ ] Error messages are clear and helpful
- [ ] Validation prevents invalid inputs
- [ ] Works on iPhone (Safari)
- [ ] Works on Android (Chrome)
- [ ] No console errors in any browser
- [ ] Bundle size < 500KB
- [ ] Deployed to Cloudflare Workers
- [ ] Production URL is accessible
- [ ] API responds < 200ms

## Validation

Manual testing checklist:

**Desktop:**
1. Open in Chrome, Firefox, Safari
2. Verify layout looks good
3. Test all functionality
4. Check browser console for errors

**Mobile:**
1. Open on iPhone or iOS simulator
2. Open on Android or emulator
3. Test touch interactions
4. Verify text is readable
5. Test in landscape and portrait

**Production:**
1. Deploy to Cloudflare Workers
2. Visit production URL
3. Test complete workflow
4. Verify API calls work
5. Check response times
6. Monitor for errors

## Performance Targets

- Initial load: < 3s on 3G
- API response: < 200ms
- Bundle size: < 500KB
- No layout shift
- Smooth animations (60fps)

## Not Included

- Advanced animations
- Multiple themes
- Customizable styling
- PWA features
- Offline support
- Analytics integration
