# Project Documentation Directory

This directory contains comprehensive specification and steering documents for the Balatro Card Probability Calculator project.

## Purpose

**For AI Assistants**: This directory provides complete project context, requirements, and technical specifications to guide implementation and development decisions.

**For Developers**: Reference documentation for understanding architecture, design decisions, and implementation guidelines.

## Directory Structure

```
.project/
├── README.md (this file)
├── plans/                       # 👉 START HERE for implementation
│   ├── README.md                # Read first: Implementation order
│   ├── implementation-strategy.md  # Read second: Simplicity principles
│   ├── decision-framework.md    # Read third: Decision-making guide
│   ├── todos-phase1-core.md     # Step-by-step core tasks
│   ├── todos-phase2-polish.md   # Step-by-step polish tasks
│   ├── mvp-core-functionality.md   # Technical spec for core
│   ├── mvp-polish-deploy.md     # Technical spec for polish
│   └── post-mvp-phases.md       # Future features (user-requested only)
├── requirements/
│   ├── STARTING_PROMPT.md       # Original project specification
│   ├── CONTINUE.md              # Session continuation guide
│   ├── overview.md              # Detailed project requirements
│   ├── architecture.md          # System architecture details
│   ├── technical.md             # Technical stack and tools
│   └── data-schema.md           # Complete data structures
├── frontend-spec.md             # React component specifications
├── backend-spec.md              # Cloudflare Worker + Python API
├── calculation-spec.md          # Hypergeometric distribution implementation
└── setup.md                     # Setup and configuration guide
```

## Quick Start - Implementation Order

### 👉 Ready to Build? Start Here:

**Go to `plans/README.md` and follow the documents in this exact order:**

1. **plans/implementation-strategy.md** - Understand simplicity principles FIRST
2. **plans/decision-framework.md** - Learn how to make decisions
3. **plans/todos-phase1-core.md** - Build core functionality (step-by-step)
4. **plans/todos-phase2-polish.md** - Polish and deploy (step-by-step)
5. **plans/post-mvp-phases.md** - Only read after MVP deployed and users request features

### Understanding the Project (Context)

For background and context:

1. **requirements/CONTINUE.md** - Session continuation, current status
2. **requirements/overview.md** - Target users (Balatro players ONLY), goals
3. **requirements/architecture.md** - System design overview

### Reference Documentation

Use these while implementing (referenced from todos):

- **setup.md** - Environment setup and configuration
- **frontend-spec.md** - React component specifications
- **backend-spec.md** - API endpoint specification
- **calculation-spec.md** - Mathematical implementation
- **plans/mvp-core-functionality.md** - Core technical specs
- **plans/mvp-polish-deploy.md** - Polish technical specs

## Core Principles

### CRITICAL: Simplicity First

All steering documents emphasize:
- **NO overengineering**
- **NO premature optimization**
- **NO excessive testing for MVP**
- Build minimum viable product FIRST
- Add complexity ONLY when proven necessary

### Target Audience

**This tool is ONLY for Balatro players during active gameplay.**

NOT for:
- General card game enthusiasts
- Mathematics students
- Strategy gamers in general

The calculator must be:
- Fast enough to use mid-game
- Simple enough to not interrupt gameplay
- Accurate enough to trust for decisions

## Key Technical Decisions

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS v4
- Minimal state management (useState only)
- 4 main components total
- No component library
- No state management library

### Backend
- Cloudflare Workers
- Python 3.11+ with scipy
- ONE endpoint: POST /api/calculate
- Stateless, no database

### Deployment
- Cloudflare Workers (free tier)
- wrangler CLI
- No CI/CD for MVP

## Document Relationships

```
STARTING_PROMPT.md
    ├─→ overview.md (expanded requirements)
    ├─→ architecture.md (system design)
    └─→ technical.md (stack decisions)

architecture.md
    ├─→ frontend-spec.md (UI implementation)
    ├─→ backend-spec.md (API implementation)
    ├─→ calculation-spec.md (math implementation)
    └─→ data-schema.md (type definitions)

All specs feed into:
    ├─→ roadmap.md (timeline)
    └─→ setup.md (how to build)
```

## For AI Assistants

### Session Initialization

1. Read `requirements/CONTINUE.md` first
2. Check which phase of development is current
3. Review relevant spec files for the task
4. Follow simplicity principles throughout
5. Verify work before marking complete

### Making Decisions

When uncertain:
1. Check relevant spec file first
2. Follow SIMPLICITY principle
3. Prefer existing patterns over new ones
4. Ask user if unclear about business requirements
5. Document decisions in code comments

### Key Reminders

- Target users are **Balatro players only**
- **No emojis** in code, commits, or documentation
- **Verify** before marking tasks complete (`npm run build`)
- Research current docs, cite sources
- Base decisions on technical merit, not assumptions

## For Developers

### Getting Started

**Follow this exact order:**

1. **Read** `plans/README.md` - Understand the implementation workflow
2. **Read** `plans/implementation-strategy.md` - Understand simplicity principles
3. **Read** `plans/decision-framework.md` - Learn decision-making process
4. **Read** `setup.md` - Set up your environment
5. **Follow** `plans/todos-phase1-core.md` - Build core functionality step-by-step
6. **Follow** `plans/todos-phase2-polish.md` - Polish and deploy step-by-step

### Common Questions

**Q: Should I add a new feature?**
A: Apply the 4-question framework from `plans/decision-framework.md`. If it's not in MVP scope (see `plans/todos-phase1-core.md` and `plans/todos-phase2-polish.md`), don't build it yet.

**Q: Which state management library?**
A: None. Use React useState. See `plans/implementation-strategy.md` for rationale.

**Q: How should I handle errors?**
A: See error handling in `backend-spec.md`, `frontend-spec.md`, and `plans/todos-phase2-polish.md` Step 2.

**Q: What testing is required?**
A: Minimal for MVP. Manual testing only. See `plans/implementation-strategy.md` section "No Testing (MVP)".

## MVP Scope

### Must Have
1. Display standard 52-card deck
2. Add/remove cards from deck
3. Calculate probability (rank, suit, color)
4. Display result as percentage
5. Works on desktop and mobile
6. Deploy to Cloudflare Workers

### Explicitly NOT in MVP
- Deck save/load
- Calculation history
- Complex queries (compound conditions)
- Jokers or special cards
- Expected value calculations
- User accounts
- Analytics

## Next Steps

**Ready to implement?**

1. Go to `plans/README.md`
2. Follow the sequential implementation guide
3. Start with `plans/implementation-strategy.md`
4. Then follow `plans/todos-phase1-core.md`
5. Ship it when Phase 2 is complete

## Summary

**Status**: All planning documents complete. Ready for implementation.

**Remember**: Keep it simple. Build MVP. Add complexity only when needed.
