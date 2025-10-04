# Phase 2: Polish & Deployment - Implementation Tasks

**Prerequisites:** Complete all tasks in `todos-phase1-core.md` first.

**Reference:** See `mvp-polish-deploy.md` for technical specifications.

## Step 1: Balatro-Style Design

Complete in order:

### 1.1 Create Dark Theme
- [ ] Add CSS variables for color scheme to `index.css`
- [ ] Dark background (#1a1a1a)
- [ ] Secondary background (#2d2d2d)
- [ ] Text colors (white, light gray)
- [ ] Accent color (orange/red)
- [ ] Apply to body and main containers

### 1.2 Style Cards
- [ ] Add gradient background to cards
- [ ] Add border radius
- [ ] Add hover effect (transform translateY)
- [ ] Add transition animation
- [ ] Make rank and suit clearly visible
- [ ] Add shadow for depth
- [ ] Style differently for each suit color (red/black)

### 1.3 Style Form Controls
- [ ] Style dropdowns with dark theme
- [ ] Style number inputs
- [ ] Style buttons (Calculate, Add Card)
- [ ] Add hover states
- [ ] Add focus states
- [ ] Make touch-friendly (min 44px height)

### 1.4 Style Result Display
- [ ] Large, prominent percentage display
- [ ] Clear explanation text
- [ ] Success/error color coding
- [ ] Add visual separation from inputs

### 1.5 Visual Testing
- [ ] Compare to Balatro screenshots
- [ ] Verify dark theme consistency
- [ ] Check all hover states work
- [ ] Verify readability
- [ ] Get feedback on aesthetics

**Checkpoint:** App looks professional and Balatro-inspired.

---

## Step 2: Improve Error Messages

Complete in order:

### 2.1 Create Error Message Function
- [ ] Create `src/lib/errors.ts`
- [ ] Define error types (INVALID_DRAW_COUNT, etc.)
- [ ] Implement `getErrorMessage(error)` function
- [ ] Return clear, helpful messages
- [ ] Include specific values in messages

### 2.2 Update API Client
- [ ] Parse error responses from backend
- [ ] Map to error types
- [ ] Return typed errors

### 2.3 Update Components
- [ ] Display errors from API client
- [ ] Show validation errors inline
- [ ] Use error message function
- [ ] Style errors clearly (red text)
- [ ] Make errors dismissible

### 2.4 Test All Error Scenarios
- [ ] Test: draw count too high
- [ ] Test: min matches too high
- [ ] Test: network failure
- [ ] Test: invalid search criteria
- [ ] Verify all errors are clear
- [ ] Verify errors show helpful guidance

**Checkpoint:** All errors have clear, helpful messages.

---

## Step 3: Add Validation Feedback

Complete in order:

### 3.1 Implement Input Validation
- [ ] Validate draw count (1 to deck size)
- [ ] Validate min matches (0 to draw count)
- [ ] Validate search value exists
- [ ] Update validation on every input change

### 3.2 Add Visual Feedback
- [ ] Disable Calculate button when invalid
- [ ] Show red border on invalid inputs
- [ ] Show green border on valid inputs
- [ ] Display validation message under field
- [ ] Clear validation message when valid

### 3.3 Prevent Invalid States
- [ ] Set max attribute on draw count input
- [ ] Set max attribute on min matches input
- [ ] Update max values when deck changes
- [ ] Don't allow form submission when invalid

### 3.4 Test Validation
- [ ] Test: draw count updates when deck changes
- [ ] Test: min matches max updates with draw count
- [ ] Test: button disables appropriately
- [ ] Test: visual feedback is clear
- [ ] Verify no way to submit invalid data

**Checkpoint:** Validation prevents all invalid inputs.

---

## Step 4: Responsive Design

Complete in order:

### 4.1 Mobile Layout
- [ ] Test on 320px width (smallest phones)
- [ ] Adjust card grid for small screens (4 columns)
- [ ] Stack form inputs vertically
- [ ] Reduce padding/margins for mobile
- [ ] Verify all text is readable
- [ ] Test touch interactions

### 4.2 Tablet Layout
- [ ] Test on 768px width (iPad)
- [ ] Adjust card grid (8 columns)
- [ ] Two-column form layout
- [ ] Optimize spacing
- [ ] Test in portrait and landscape

### 4.3 Desktop Layout
- [ ] Test on 1024px+ width
- [ ] Full card grid (13 columns)
- [ ] Side-by-side layout (deck + controls)
- [ ] Optimize for large screens
- [ ] Verify no wasted space

### 4.4 Touch Targets
- [ ] Verify all buttons >= 44px height
- [ ] Add spacing between touch targets
- [ ] Test card removal on touch devices
- [ ] Test dropdown interactions
- [ ] Verify no accidental taps

### 4.5 Cross-Device Testing
- [ ] iPhone (Safari)
- [ ] Android phone (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Verify layout works on all

**Checkpoint:** App works well on all screen sizes.

---

## Step 5: Browser Testing

Complete in order:

### 5.1 Chrome Testing
- [ ] Latest Chrome on desktop
- [ ] Chrome mobile on Android
- [ ] Check console for errors
- [ ] Verify all features work
- [ ] Test performance

### 5.2 Firefox Testing
- [ ] Latest Firefox on desktop
- [ ] Check console for errors
- [ ] Verify styling matches Chrome
- [ ] Test all features
- [ ] Fix any Firefox-specific issues

### 5.3 Safari Testing
- [ ] Latest Safari on macOS
- [ ] Safari on iPhone/iPad
- [ ] Check console for errors
- [ ] Test all features
- [ ] Fix any Safari-specific issues

### 5.4 Create Browser Compatibility List
- [ ] Document tested browsers and versions
- [ ] Note any known issues
- [ ] Document workarounds if needed

**Checkpoint:** App works in all major browsers.

---

## Step 6: Production Build

Complete in order:

### 6.1 Clean Build
- [ ] Delete `dist/` and `.vite/` directories
- [ ] Run `npm run build`
- [ ] Verify build succeeds
- [ ] Check for build warnings

### 6.2 Analyze Bundle
- [ ] Check `dist/` directory size
- [ ] Verify bundle < 500KB
- [ ] Identify large dependencies if needed
- [ ] Review included files

### 6.3 Test Production Build
- [ ] Run `npm run preview`
- [ ] Open preview URL
- [ ] Test all functionality
- [ ] Verify API calls work
- [ ] Check console for errors
- [ ] Test on mobile

### 6.4 Optimize if Needed
- [ ] If bundle > 500KB, analyze why
- [ ] Remove unused dependencies
- [ ] Optimize images if any
- [ ] Re-build and verify

**Checkpoint:** Production build works and is optimized.

---

## Step 7: Cloudflare Workers Deployment

Complete in order:

### 7.1 Prepare for Deployment
- [ ] Verify `wrangler.toml` is configured
- [ ] Verify `worker/index.py` is complete
- [ ] Verify `dist/` contains production build
- [ ] Check Cloudflare account is set up

### 7.2 Initial Deployment
- [ ] Run `wrangler login` if needed
- [ ] Run `wrangler deploy`
- [ ] Note the deployment URL
- [ ] Verify deployment succeeds

### 7.3 Test Production Deployment
- [ ] Visit production URL
- [ ] Verify page loads
- [ ] Test deck display
- [ ] Test adding/removing cards
- [ ] Test calculation
- [ ] Verify API calls work
- [ ] Check response times

### 7.4 Test from Different Locations
- [ ] Test from desktop
- [ ] Test from mobile device
- [ ] Test from different network
- [ ] Verify works for all

**Checkpoint:** App is deployed and accessible.

---

## Step 8: Performance Verification

Complete in order:

### 8.1 Load Time Testing
- [ ] Open Chrome DevTools Network tab
- [ ] Hard reload (Cmd+Shift+R)
- [ ] Verify load time < 3s on Fast 3G
- [ ] Verify load time < 1s on WiFi
- [ ] Check bundle size downloaded

### 8.2 API Performance Testing
- [ ] Open Network tab
- [ ] Make calculation request
- [ ] Verify response time < 200ms
- [ ] Test multiple calculations
- [ ] Verify consistent performance

### 8.3 Lighthouse Audit
- [ ] Run Lighthouse in Chrome DevTools
- [ ] Check Performance score
- [ ] Check Accessibility score
- [ ] Check Best Practices score
- [ ] Address any critical issues

### 8.4 Real Device Testing
- [ ] Test on actual mobile device
- [ ] Verify load time acceptable
- [ ] Verify calculations are fast
- [ ] Check for lag or jank

**Checkpoint:** Performance meets all targets.

---

## Step 9: Final Testing

Complete in order:

### 9.1 Complete Workflow Test
- [ ] Open production URL
- [ ] See standard 52-card deck
- [ ] Remove 5 random cards
- [ ] Add 2 cards back
- [ ] Calculate: at least 1 Ace in 5 cards
- [ ] Verify result makes sense
- [ ] Try 3 more different queries
- [ ] Verify all work correctly

### 9.2 Error Handling Test
- [ ] Try to draw 100 cards from 52
- [ ] Verify error message is clear
- [ ] Try min matches > draw count
- [ ] Verify validation prevents submission
- [ ] Test with network disconnected
- [ ] Verify network error is handled

### 9.3 Edge Case Testing
- [ ] Remove all cards from deck
- [ ] Try to calculate
- [ ] Verify appropriate error
- [ ] Add cards back
- [ ] Test with unusual queries
- [ ] Verify all cases handled

### 9.4 User Acceptance Testing
- [ ] Give URL to someone unfamiliar
- [ ] Watch them use it (don't help)
- [ ] Note any confusion
- [ ] Note any errors
- [ ] Fix critical issues
- [ ] Document minor issues for later

**Checkpoint:** App works well for real users.

---

## Step 10: Documentation

Complete in order:

### 10.1 Update Root README
- [ ] Add production URL to README.md
- [ ] Verify Quick Start instructions work
- [ ] Update any outdated information
- [ ] Add screenshots if helpful

### 10.2 Document Known Issues
- [ ] Create KNOWN_ISSUES.md if needed
- [ ] List any browser-specific quirks
- [ ] Document workarounds
- [ ] Note planned fixes

### 10.3 Create Simple User Guide
- [ ] How to modify deck
- [ ] How to enter query
- [ ] How to interpret results
- [ ] Common questions

**Checkpoint:** Documentation is complete.

---

## Phase 2 Complete

Before considering MVP done:
- [ ] All checkpoints passed
- [ ] App deployed to production
- [ ] Performance meets targets
- [ ] Works on all platforms
- [ ] Error handling is robust
- [ ] Looks professional
- [ ] User testing successful

## Next Steps

**MVP is complete!**

Now:
1. Share with Balatro community
2. Collect user feedback
3. Monitor for bugs
4. Only add features if users request them

**Do not proceed to post-MVP phases unless users request features.**

See `post-mvp-phases.md` for future enhancement ideas (only implement if demanded by users).
