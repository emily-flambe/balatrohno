# Decision Framework

Guidelines for making technical and product decisions.

## Core Decision Principle

**Evidence > assumptions**

Base all decisions on measurable data, user feedback, or documented best practices. Never on gut feelings or "it would be cool if".

## Before Adding Any Feature

Ask these four questions in order:

### 1. Did a user request it?
**Evidence Required:**
- Direct user request (issue, email, Discord message)
- Multiple independent requests (3+ for small features, 10+ for large)
- User pain point documented

**If NO:** Don't build it.
**If YES:** Proceed to question 2.

### 2. Does it solve a real problem?
**Not Acceptable:**
- "It would be nice to have"
- "Other tools have this"
- "It's cool technology"

**Acceptable:**
- "Users can't accomplish X without it"
- "Current workflow is broken"
- "This removes a documented pain point"

**If NO:** Don't build it.
**If YES:** Proceed to question 3.

### 3. Is it simple to implement?
**Simple:** < 1 day of focused work, no new dependencies, minimal code
**Complex:** > 1 day, requires new libraries, significant code changes

**If COMPLEX:** Reconsider or break down into simpler steps.
**If SIMPLE:** Proceed to question 4.

### 4. Will it slow down the core use case?
**Core Use Case:** Balatro player quickly checking probability mid-game

**Will it slow down if:**
- Adds loading time
- Makes UI more complex
- Adds steps to workflow
- Increases bundle size significantly
- Requires additional API calls

**If YES:** Don't build it.
**If NO:** Feature is approved.

## Technical Decision Framework

### Choosing Dependencies

Before adding any npm package:

**Required Justification:**
1. What problem does this solve?
2. Can we solve it without a dependency?
3. What's the bundle size impact?
4. When was it last updated?
5. How many GitHub issues are open?
6. What's our fallback if it's abandoned?

**Red Flags:**
- Last update > 1 year ago
- Bundle size > 100KB
- Duplicate functionality we already have
- Can be implemented in < 100 lines of code
- Only using 10% of the package

**Example - Good Decision:**
```
Package: scipy (Python)
Problem: Hypergeometric distribution calculation
Alternative: Manual implementation
Decision: Use scipy
Reasoning:
- Calculation is complex and error-prone
- scipy is industry standard
- Well-maintained
- Can't easily implement ourselves correctly
```

**Example - Bad Decision:**
```
Package: lodash
Problem: Need to get unique array values
Alternative: [...new Set(array)]
Decision: DON'T use lodash
Reasoning:
- Built-in JS handles this
- lodash adds 71KB
- Only need one function
- Native solution is one line
```

### State Management Decisions

**Decision Tree:**

```
Is state used by 1 component only?
├─ YES → useState in that component
└─ NO → Is state used by 2-3 components?
    ├─ YES → Lift state to common parent
    └─ NO → Is state used by 5+ components?
        ├─ YES → Consider Context API
        └─ NO → Use prop drilling (this app has 4 components)
```

**For this project:** useState is sufficient for everything.

### Styling Decisions

**Decision Tree:**

```
Do we need dynamic styles based on JS state?
├─ YES → Tailwind classes with conditional application
└─ NO → Static Tailwind classes

Do we need complex animations?
├─ YES → Consider animation library ONLY if requested by users
└─ NO → CSS transitions are sufficient
```

**For this project:** Tailwind utility classes for everything.

### API Design Decisions

**Decision Tree:**

```
How many different operations do we need?
├─ 1 operation → 1 endpoint (POST /api/calculate)
├─ 2-5 operations → Consider RESTful endpoints
└─ 6+ operations → Consider GraphQL or tRPC

Is real-time data needed?
├─ YES → WebSockets or SSE
└─ NO → Regular HTTP (this project)
```

**For this project:** Single POST endpoint is sufficient.

## Performance Decision Framework

### When to Optimize

**Don't Optimize When:**
- No performance problem has been reported
- No metrics show slowness
- Just assuming something might be slow

**Do Optimize When:**
- Measured performance < target
- Users report slowness
- Metrics show problem

**Performance Targets:**
- Initial load: < 3s on 3G
- API response: < 200ms
- UI interactions: < 100ms
- Bundle size: < 500KB

### Optimization Priority

If performance is below target:

1. **Measure first** (Chrome DevTools, Lighthouse)
2. **Identify bottleneck** (where is time actually spent?)
3. **Fix the biggest issue first** (80/20 rule)
4. **Measure again** (verify improvement)
5. **Repeat if still below target**

**Don't:**
- Optimize everything at once
- Optimize without measuring
- Add complexity for minor gains

## Quality Decision Framework

### When to Add Testing

**Don't Add Tests When:**
- MVP not complete
- No users yet
- Features changing rapidly

**Do Add Tests When:**
- Breaking existing features regularly
- Complex calculation logic stabilized
- User base relies on correctness
- Adding risky changes

**Testing Priority for This Project:**
1. Manual testing (MVP)
2. Calculation function tests (if errors occur)
3. Integration tests (if user-reported bugs increase)
4. E2E tests (if regression bugs common)

### Code Quality Thresholds

**Acceptable for MVP:**
- Some duplication (< 3 instances)
- Inline styles for one-off cases
- Basic error handling
- Simple validation

**Requires Refactoring:**
- Duplication > 3 instances → Extract function
- Component > 300 lines → Split component
- Function > 50 lines → Consider breaking up
- Nesting > 4 levels → Simplify logic

## User Feedback Integration

### Evaluating Feature Requests

**Immediate Priority (1 week):**
- Core functionality broken
- Cannot complete primary use case
- Data loss or corruption
- Security vulnerability

**High Priority (1 month):**
- Frequently requested (5+ users)
- Solves documented pain point
- Simple to implement
- No workarounds available

**Low Priority (3 months):**
- Requested by 1-2 users
- Workarounds exist
- Complex implementation
- Not core use case

**Won't Build:**
- Requested by 0 users (our idea)
- Out of scope (not for Balatro players)
- Would slow down core use case
- Excessive complexity

### Responding to Bug Reports

**Critical (Fix Immediately):**
- App completely broken
- Data loss
- Security issue
- API always fails

**High (Fix Within 1 Day):**
- Feature broken for all users
- Incorrect calculations
- Cannot complete workflow

**Medium (Fix Within 1 Week):**
- Feature broken for some users
- Confusing UX
- Minor calculation errors
- Validation issues

**Low (Fix When Convenient):**
- Cosmetic issues
- Minor UX improvements
- Edge cases
- Feature requests

## Architecture Decision Records

For significant technical decisions, document:

### Template

```markdown
# ADR-001: Decision Title

## Context
What is the situation we're addressing?

## Decision
What did we decide?

## Consequences
What are the trade-offs?
```

### Example

```markdown
# ADR-001: Use Single POST Endpoint

## Context
Need to calculate probabilities from frontend.
Could use REST, GraphQL, or single endpoint.

## Decision
Use single POST /api/calculate endpoint.

## Consequences
Positive:
- Simple to implement
- Easy to test
- No routing complexity
- Minimal code

Negative:
- If we need more operations, will need to add endpoints
- Not RESTful (but don't need REST for one operation)

Decision: Benefits outweigh drawbacks for MVP.
```

## Reversal Criteria

Any decision can be reversed if:

1. **User feedback** contradicts assumptions
2. **Metrics** show decision was wrong
3. **Better alternative** becomes available
4. **Original problem** no longer exists

**But:**
- Don't reverse based on new ideas without evidence
- Don't reverse because "other way seems better"
- Don't reverse to use newer technology

## Summary

**Make decisions based on evidence, not assumptions.**

Four-question framework for features:
1. Did a user request it?
2. Does it solve a real problem?
3. Is it simple to implement?
4. Will it slow down the core use case?

All four must be favorable to proceed.

**When in doubt, don't build it.** Wait for evidence of need.
