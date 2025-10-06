# Hand View Feature Planning

## Purpose
Enable Balatro players to simulate their hand during gameplay to calculate optimal discard decisions.

## Planning Documents Order

### Phase 1: Core Hand Management
1. **hand-view-requirements.md** - Feature requirements and user stories
2. **hand-view-technical-spec.md** - Technical implementation details
3. **hand-view-ui-spec.md** - UI/UX specifications
4. **hand-view-implementation-tasks.md** - Step-by-step implementation tasks

### Phase 2: Discard Probability Table
5. **discard-table-spec.md** - Probability table requirements and calculations
6. **discard-table-implementation-tasks.md** - Implementation tasks for probability table

## Implementation Order

1. Read this README first
2. Review `hand-view-requirements.md` to understand user needs
3. Review `hand-view-technical-spec.md` for technical approach
4. Review `hand-view-ui-spec.md` for component structure
5. Follow `hand-view-implementation-tasks.md` step-by-step
6. After core feature complete, proceed to `discard-table-spec.md`
7. Follow `discard-table-implementation-tasks.md` for table feature

## Quality Checklist

Before marking any task complete:
- [ ] Code follows simplicity principle (no overengineering)
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] Manual testing confirms feature works
- [ ] No emojis in code or UI
- [ ] No console errors

## Key Principles

- **Simplicity First**: Use React state, no complex state management
- **User-Focused**: Fast interactions for mid-game use
- **No Premature Optimization**: Build working feature first
- **Clear Data Flow**: Deck → Hand → Discard with explicit actions