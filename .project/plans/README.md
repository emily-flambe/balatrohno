# Implementation Plans - Read in This Order

Sequential guide for implementing the Balatro Probability Calculator MVP.

## Quick Start

**Start here:** Follow documents in this exact order:

1. `implementation-strategy.md` - Read first to understand approach
2. `decision-framework.md` - Read second to understand how to make decisions
3. `todos-phase1-core.md` - Implement core functionality
4. `todos-phase2-polish.md` - Polish and deploy
5. `post-mvp-phases.md` - Only read after MVP is deployed and users request features

## Document Overview

### Read Before Starting

**1. implementation-strategy.md** (Read First)
- Core simplicity principles
- What NOT to build
- Anti-patterns to avoid
- Technical decision guidelines

**Purpose:** Understand the philosophy before writing any code.

**2. decision-framework.md** (Read Second)
- 4-question framework for features
- Technical decision trees
- When to optimize
- When to add testing

**Purpose:** Know how to make decisions during implementation.

---

### Implementation Phase

**3. todos-phase1-core.md** (Start Implementation Here)
- Step-by-step tasks for core functionality
- Sequential order with checkpoints
- Complete before moving to Phase 2

**Completion Criteria:**
- [ ] All 11 steps completed
- [ ] All checkpoints passed
- [ ] Working calculator that gives accurate probabilities
- [ ] Tested on desktop and mobile

**4. todos-phase2-polish.md** (After Phase 1 Complete)
- Step-by-step tasks for polish and deployment
- Sequential order with checkpoints
- Complete before considering MVP done

**Completion Criteria:**
- [ ] All 10 steps completed
- [ ] All checkpoints passed
- [ ] Professional appearance
- [ ] Deployed to production
- [ ] Performance targets met

---

### Reference Documents

**mvp-core-functionality.md** (Reference During Phase 1)
- Technical specifications for core features
- Code examples and interfaces
- Success criteria

**When to use:** While implementing Phase 1 tasks, reference this for technical details.

**mvp-polish-deploy.md** (Reference During Phase 2)
- Technical specifications for polish and deployment
- Styling guidelines
- Performance targets

**When to use:** While implementing Phase 2 tasks, reference this for technical details.

---

### Post-MVP (Only After User Requests)

**5. post-mvp-phases.md** (Read Only After MVP Deployed)
- Phase 3: Quality of life improvements
- Phase 4: Balatro-specific features
- Phase 5: Advanced features
- Evaluation criteria for each

**When to read:** Only after MVP is deployed and users are actively requesting features.

**Important:** Do NOT implement anything from this document until:
1. MVP is deployed and working
2. Users are actively using it
3. Users explicitly request features
4. Features pass the 4-question framework

---

## Implementation Workflow

```
┌─────────────────────────────────────┐
│ 1. Read implementation-strategy.md  │
│    Understand philosophy            │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 2. Read decision-framework.md       │
│    Learn decision-making process    │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 3. Follow todos-phase1-core.md      │
│    Complete all 11 steps            │
│    Reference mvp-core-functionality │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│    Checkpoint: Phase 1 Complete?    │
│    - All tasks done                 │
│    - Calculator works               │
│    - Calculations accurate          │
└────────────────┬────────────────────┘
                 │ YES
                 ▼
┌─────────────────────────────────────┐
│ 4. Follow todos-phase2-polish.md    │
│    Complete all 10 steps            │
│    Reference mvp-polish-deploy      │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│    Checkpoint: Phase 2 Complete?    │
│    - All tasks done                 │
│    - Looks professional             │
│    - Deployed to production         │
│    - Performance meets targets      │
└────────────────┬────────────────────┘
                 │ YES
                 ▼
┌─────────────────────────────────────┐
│         🎉 MVP Complete! 🎉         │
│                                     │
│ Share with Balatro community        │
│ Collect user feedback               │
│ Monitor for bugs                    │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  Wait for User Feature Requests     │
│                                     │
│  IF users request features:         │
│  - Read post-mvp-phases.md          │
│  - Apply 4-question framework       │
│  - Only build if all 4 are YES      │
└─────────────────────────────────────┘
```

## Time Commitment Estimate

**Phase 1 (Core Functionality):**
- Setup: 1-2 hours
- Data types: 30 minutes
- Backend: 2-3 hours
- Frontend: 4-6 hours
- Integration: 1-2 hours
- Testing: 1-2 hours

**Phase 2 (Polish & Deploy):**
- Styling: 2-3 hours
- Error handling: 1-2 hours
- Responsive design: 2-3 hours
- Browser testing: 1-2 hours
- Deployment: 1 hour
- Final testing: 1-2 hours

**Note:** These are estimates. Take as long as needed to do it right.

## Critical Reminders

### Simplicity First
- Build minimum viable product FIRST
- Don't add features "just in case"
- Don't optimize prematurely
- Don't abstract early

### Validation Before Moving Forward
- Complete all checkpoints before next step
- Test thoroughly before proceeding
- Fix issues immediately, don't accumulate debt

### Deployment Criteria
- All functionality works
- No console errors
- Performance meets targets
- Tested on desktop and mobile

## Getting Help

If stuck on a task:

1. **Check technical specs:** mvp-core-functionality.md or mvp-polish-deploy.md
2. **Review decision framework:** How should this decision be made?
3. **Check implementation strategy:** Am I overcomplicating this?
4. **Consult setup.md:** Configuration or setup issues
5. **Read relevant spec files:** frontend-spec.md, backend-spec.md, calculation-spec.md

## Success Criteria

### MVP Success
- [ ] Can calculate probability correctly
- [ ] Works on desktop and mobile
- [ ] Loads in < 2 seconds
- [ ] Calculation takes < 100ms
- [ ] Looks professional
- [ ] Deployed to production

### Post-MVP Success
- [ ] People actually use it while playing Balatro
- [ ] Gets shared in Balatro Discord
- [ ] Users request new features
- [ ] No major bugs reported

## Summary

**Order of operations:**

1. Read strategy and framework docs
2. Implement Phase 1 (core)
3. Implement Phase 2 (polish)
4. Deploy and share
5. Wait for user feedback
6. Only add features if users request them

**Keep it simple. Build what's needed. Ship it.**
