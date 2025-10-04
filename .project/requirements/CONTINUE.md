# Continuation Guide

## Project Context

**Project Name**: Balatro Card Probability Calculator (balatrohno)

**Purpose**: Companion tool for Balatro players to calculate card draw probabilities during active gameplay. NOT an educational tool or general card game calculator.

**Target User**: Balatro players who keep this open while playing to make real-time strategic decisions.

## What's Been Completed

### Documentation Created ✅

All in `.project/` directory:

1. **overview.md** - Project vision, target users (BALATRO PLAYERS ONLY), success metrics
2. **architecture.md** - System architecture, component specs, data flow
3. **data-schema.md** - TypeScript types, state management patterns
4. **frontend-spec.md** - Component specifications with SIMPLICITY emphasis
5. **backend-spec.md** - Single endpoint `/api/calculate`, Python integration
6. **calculation-spec.md** - Hypergeometric distribution with scipy
7. **roadmap.md** - MVP focus, 2-week timeline, anti-feature-creep guidance
8. **setup.md** - Setup instructions, configuration, deployment

### Also Created

- `.project/requirements/overview.md` - Detailed requirements (updated for Balatro-only audience)
- `.project/requirements/architecture.md` - Detailed architecture
- `.project/requirements/technical.md` - Tech stack requirements
- `.project/requirements/data-schema.md` - Comprehensive data types
- Directory structure created in `.project/`

## What's Remaining

### Still Need to Create

1. **`.project/README.md`** - Entry point for developers, explains directory structure
2. **Project root `README.md`** - User-facing README with project description

### Implementation NOT STARTED

The entire codebase needs to be built:
- `src/` - React frontend
- `worker/` - Cloudflare Worker with Python
- `python/` - Calculation scripts
- Config files (package.json, vite.config.ts, etc.)

## Key Design Decisions

### CRITICAL: Simplicity First

**The steering documents heavily emphasize:**
- NO overengineering
- NO premature optimization
- NO excessive testing for MVP
- Build minimum viable product FIRST
- Add complexity ONLY when proven necessary

### Architecture Choices

**Frontend:**
- React + TypeScript + Vite + Tailwind CSS
- Minimal state management (just useState)
- 4 main components total
- No state management library
- No component library

**Backend:**
- ONE endpoint: POST /api/calculate
- Python + scipy for hypergeometric distribution
- Cloudflare Workers deployment
- Stateless, no database

**Data:**
- No persistence (MVP)
- No localStorage
- Deck resets on page reload

### Tech Stack

```
Frontend: React 18 + TypeScript + Vite + Tailwind v4
Backend: Cloudflare Workers + Python 3.11+
Calculation: scipy.stats.hypergeom
Deployment: Cloudflare Workers (wrangler)
```

## Target Users - IMPORTANT

**This is ONLY for Balatro players during active gameplay.**

NOT for:
- General card game enthusiasts
- Mathematics students
- Strategy gamers in general

The tool should be:
- Fast enough to use mid-game
- Simple enough to not interrupt gameplay
- Accurate enough to trust for decisions

## MVP Scope

### Must Have (Week 1-2)

1. Display standard 52-card deck
2. Add/remove cards from deck
3. Calculate probability (rank, suit, color)
4. Display result as percentage
5. Works on desktop and mobile
6. Deploy to Cloudflare Workers

### Explicitly NOT in MVP

- Deck save/load
- Deck templates
- Calculation history
- Complex queries (compound conditions)
- Jokers or special Balatro cards
- Expected value calculations
- User accounts
- Analytics

## File Structure Reference

```
.project/
├── requirements/
│   ├── overview.md
│   ├── architecture.md
│   ├── technical.md
│   ├── data-schema.md
│   └── CONTINUE.md (this file)
├── overview.md (duplicate, can be removed)
├── architecture.md (duplicate, can be removed)
├── data-schema.md (duplicate, can be removed)
├── frontend-spec.md
├── backend-spec.md
├── calculation-spec.md
├── roadmap.md
└── setup.md
```

## Next Steps for New Session

### Immediate Tasks

1. **Create `.project/README.md`**
   - Explain directory structure
   - Guide for AI assistants
   - Guide for developers

2. **Create root `README.md`**
   - Project description
   - Quick start guide
   - Link to setup.md

3. **Clean up duplicates**
   - Remove duplicate files in `.project/` root if desired
   - Consolidate into `requirements/` subdirectory

### Implementation Phase

Follow `roadmap.md` Phase 1:

1. **Day 1-2: Frontend Components**
   - Create basic React structure
   - Build Card, DeckDisplay, DeckControls, Calculator components
   - Use Tailwind for styling

2. **Day 3-4: Backend + Python**
   - Create `worker/index.py` with single endpoint
   - Implement scipy calculation
   - Wire up frontend to backend

3. **Day 5: Deploy and Test**
   - Deploy to Cloudflare Workers
   - Manual testing on desktop and mobile

4. **Day 6-7: Fix Bugs**
   - Address any issues found

## Important Reminders

### From AI Behavior Guidelines

- **NO EMOJIS** in code, commits, PRs, or documentation
- **NO TIME ESTIMATES** - don't suggest timelines
- Verify with `npm run build` before marking complete
- Research current documentation, cite sources
- Base decisions on objective technical merit

### From Project Principles

- **SIMPLICITY FIRST**
- Evidence > assumptions
- Code > documentation
- Efficiency > verbosity
- Guard against overengineering
- Test minimally for MVP

### Calculation Math

Use **scipy.stats.hypergeom** - don't implement hypergeometric distribution manually.

```python
from scipy.stats import hypergeom

# P(X >= k) = 1 - P(X <= k-1)
prob = 1.0 - hypergeom.cdf(k-1, N, K, n)
```

Where:
- N = deck size
- K = matching cards
- n = draw count
- k = minimum matches needed

## Questions to Ask User

If unclear about anything:

1. **Balatro-specific features**: Does MVP need any Balatro-specific card types?
2. **Deployment target**: Confirm Cloudflare Workers is the deployment platform
3. **Timeline pressure**: How soon is this needed?

## Reference Files to Read

When continuing:

1. `.project/frontend-spec.md` - Component specifications
2. `.project/backend-spec.md` - API endpoint specification
3. `.project/calculation-spec.md` - Math implementation
4. `.project/setup.md` - Configuration details
5. `.project/roadmap.md` - Development phases

## Summary

**Status**: All planning documents complete. Ready to begin implementation.

**Next**: Create README files, then start building MVP frontend components.

**Remember**: Keep it simple. Build minimum viable product. Add complexity only when needed.
