# AI Assistant Guidelines - CRITICAL RULES

## ABSOLUTE PROHIBITIONS

### 1. NEVER PUSH SECRETS
- **NEVER** commit API keys, tokens, passwords, or credentials
- **NEVER** hardcode sensitive data in any file
- **ALWAYS** use environment variables for sensitive configuration
- **ALWAYS** check files for accidental secret inclusion before commits
- **VERIFY** .gitignore includes all env files and secret stores

### 2. NO EMOJIS ANYWHERE - ZERO TOLERANCE
- **NEVER** use emojis in:
  - Source code files
  - Console logs
  - UI components
  - User-facing text
  - Code comments
  - Markdown files (except this guidelines file)
  - Commit messages
  - Pull request titles
  - Pull request descriptions
  - Issue titles
  - Issue descriptions
  - API responses
  - Error messages
  - Documentation
  - Release notes
  - ANYWHERE in the codebase or GitHub
- **ABSOLUTELY NO EMOJIS** - This means no icons, no emoticons, no symbols like 🔥, 🚀, 💡, ✨, etc.
- **PROFESSIONAL COMMUNICATION ONLY** - Use words, not pictures

## MANDATORY BEHAVIORS

### 1. TAKE INITIATIVE - EXECUTE COMMANDS YOURSELF

**CRITICAL**: You have access to CLIs and tools - USE THEM instead of telling the user to run commands.

**ALWAYS execute these yourself:**
- `gh` (GitHub CLI): Creating PRs, merging PRs, checking status, creating issues, managing releases
- `wrangler` (Cloudflare CLI): Deploying workers, checking deployments, viewing logs, managing versions
- `git`: All git operations (commit, push, pull, branch, merge, tag, etc.)
- `npm`/`pip`: Installing dependencies, running scripts, building, testing
- `curl`: Testing API endpoints, making HTTP requests
- Any CLI tool available in the environment

**Examples of REQUIRED proactive behavior:**
- **DON'T SAY**: "Now run `wrangler deploy` to deploy your changes"
- **DO**: Execute `wrangler deploy` yourself and report the results
- **DON'T SAY**: "You can create a PR with `gh pr create`"
- **DO**: Execute `gh pr create` yourself with appropriate title and body
- **DON'T SAY**: "Merge the PR when ready"
- **DO**: Ask if ready to merge, then execute `gh pr merge` yourself
- **DON'T SAY**: "Check the deployment status"
- **DO**: Execute `wrangler deployments list` and report the status
- **DON'T SAY**: "Run the tests to verify"
- **DO**: Execute `npm test` yourself and report the results

**When to ask vs. execute:**
- **ASK FIRST**: Destructive operations (delete branches, force push, drop databases)
- **ASK FIRST**: Production deployments that affect live users
- **ASK FIRST**: Major architectural changes or refactoring
- **EXECUTE IMMEDIATELY**: Development operations, testing, building, creating PRs, checking status
- **EXECUTE IMMEDIATELY**: Non-destructive git operations (commit, push to feature branches)
- **EXECUTE IMMEDIATELY**: Cloudflare Worker deployments (they're versioned and can be rolled back)

**Monitoring and follow-up:**
- After executing commands, ALWAYS check the output for errors
- If a command fails, IMMEDIATELY attempt to fix and retry
- For long-running operations, use `--watch` flags when available
- For CI/CD, actively monitor with `gh pr checks --watch`

**Zero tolerance for passive behavior:**
- **NEVER** end a response with instructions for the user to run commands you could run yourself
- **NEVER** say "you should" or "you can" when referring to CLI commands you have access to
- **ALWAYS** be proactive and execute commands on behalf of the user
- **ALWAYS** provide the output and results of commands you execute

**Example of correct proactive behavior:**
```
User: "Deploy this to production"
WRONG: "Run `wrangler deploy` to deploy to production"
RIGHT: [Executes `wrangler deploy`] "Deployed to production successfully. Worker is live at https://balatrohno.workers.dev. Deployment took 3.2 seconds. Version: abc123."
```

### 2. OBJECTIVE DECISION MAKING
- **ALWAYS** base decisions on objective technical merit
- **ALWAYS** clearly articulate trade-offs with pros/cons
- **ALWAYS** provide data-backed recommendations
- **ALWAYS** request user confirmation before major decisions
- **NEVER** make assumptions about business requirements

### 3. NO FLATTERY OR AGREEMENT PHRASES
- **NEVER** say "You're absolutely right" or similar
- **NEVER** use phrases like "You're right to question this" or "You're right to question that"
- **NEVER** say "That's a great insight" or similar praise
- **STICK TO FACTS** - Focus on the work, not validation
- **COLLABORATE** - Work together on best choices, not agreement

### 4. RESEARCH & DOCUMENTATION
- **ALWAYS** research current documentation for:
  - Framework updates
  - Best practices
  - Security guidelines
  - Performance optimizations
- **ALWAYS** cite sources in code comments with links
- **ALWAYS** verify documentation is current (check dates)
- **ALWAYS** cross-reference multiple sources for critical decisions
- **ALWAYS** check system time and use current year when searching for "latest" or "current" documentation
  - Example: If system shows 2025, search for "2025 documentation" not "2024"

### 5. VERIFICATION BEFORE COMPLETION
- **ALWAYS** test changes before declaring completion
- **ALWAYS** run linters and type checks
- **ALWAYS** verify UI changes render correctly
- **ALWAYS** check for console errors
- **ALWAYS** confirm API endpoints respond correctly
- **NEVER** say "done" without verification
- **NEVER** assume code works without testing
- **CRITICAL**: Run `npm run build` locally BEFORE pushing ANY changes that could affect the build
- **MANDATORY**: If you delete files, update imports, or modify dependencies, you MUST verify the build still works

### 6. PREFER SIMPLICITY - RESIST OVERENGINEERING
- **ALWAYS** choose the simplest solution that meets requirements
- **NEVER** add abstraction layers "just in case" or for hypothetical future needs
- **NEVER** create complex architectures when simple functions will do
- **RESIST** the urge to show off technical knowledge through unnecessary complexity
- **QUESTION** every additional dependency, library, or framework
- **PREFER** native solutions over external libraries when reasonable
- **ASK** "Will this actually be needed?" before adding any feature or abstraction
- **REMEMBER**: All code is terrible and your job is to write as little as possible while ensuring it works and is easy to maintain

### 7. TEMPORARY DEBUGGING FILES
- **ALWAYS** save ad-hoc Playwright debugging scripts to `.temp/` folder
- **ALWAYS** use `.temp/` for one-off test scripts that shouldn't be committed
- **NEVER** commit temporary debugging scripts to the repository
- **CLEAN UP** temporary files before marking tasks complete
- **PERMANENT** debugging utilities (like check-styles.ts) can stay in project root

### 8. GIT WORKTREES
- **ALWAYS** create git worktrees in the `worktrees/` folder within the project root
- **EXAMPLE**: `git worktree add worktrees/feature-branch feature-branch`
- **NEVER** create worktrees outside the project directory structure
- **ENSURE** the `worktrees/` folder is properly gitignored
- **CLEAN UP** worktrees when branches are merged or no longer needed

### 9. CI/CD MONITORING & PROACTIVE ERROR RESOLUTION
- **MANDATORY**: After pushing to a branch with an open PR, IMMEDIATELY monitor CI/CD status
- **ALWAYS** use `gh pr checks [PR-NUMBER] --watch` to actively monitor pipeline status
- **NEVER** assume CI/CD will pass - actively watch and be ready to fix issues
- **PROACTIVELY** resolve any CI/CD failures immediately upon detection
- **CONTINUOUSLY** monitor until all checks pass successfully
- **FIX** failures by: analyzing logs, reproducing locally, pushing fixes, and continuing to monitor
- **ZERO TOLERANCE** for CI/CD failures - they must be resolved before any other work continues

### 10. NO LAZY FALLBACKS OR WORKAROUNDS
- **NEVER** implement workarounds instead of fixing the actual problem
- **NEVER** say "because X isn't working, we're going to do Y instead"
- **NEVER** accept a broken or degraded solution as "good enough"
- **NEVER** use fallback URLs, fallback logic, or alternative approaches when the proper solution should work
- **ALWAYS** fix the root cause of issues, not symptoms
- **ALWAYS** ensure features work as originally designed and intended
- **Example**: If preview URLs should work with `wrangler versions upload`, make them work - don't fall back to using staging URLs

### 11. CI/CD CRITICAL BEHAVIOR
- **MANDATORY**: Read and follow `.project/guidelines/core/cicd-critical-behavior.md`
- **NEVER** change PR deployment from `wrangler versions upload` to `wrangler deploy`
- **NEVER** deploy PRs to the main staging URL
- **ALWAYS** ensure PRs get unique preview URLs with version prefixes
- **PROTECT** the staging environment - it should only update on main branch merges

## DECISION FRAMEWORK

When making any technical decision:

1. **Identify Options**: List all viable approaches
2. **Analyze Trade-offs**:
   - Performance implications
   - Maintainability
   - Scalability
   - Development time
   - Technical debt
3. **Research**: Find documentation/examples for each option
4. **Recommend**: State clear recommendation with reasoning
5. **Confirm**: Get explicit user approval before proceeding

## VERIFICATION CHECKLIST

Before marking any task complete:

- [ ] Code runs without errors
- [ ] No hardcoded secrets
- [ ] No emojis anywhere
- [ ] **MANDATORY: Run `npm run lint` - MUST PASS before declaring complete**
- [ ] **MANDATORY: Run `npm run type-check` - MUST PASS before declaring complete**
- [ ] **MANDATORY: Run `npm test` - MUST PASS (see test resolution strategy below)**
- [ ] **MANDATORY: Run `npm run build` - MUST BUILD SUCCESSFULLY locally**
- [ ] UI renders correctly (if applicable)
- [ ] API calls work (if applicable)
- [ ] Documentation updated (if needed)
- [ ] No console errors or warnings

**CRITICAL RULE**: NEVER declare work complete or create pull requests without running:
1. `npm run lint` - Fix ALL errors before proceeding
2. `npm run type-check` - Fix ALL type errors
3. `npm test` - Ensure ALL tests pass
4. `npm run build` - MUST BUILD SUCCESSFULLY before pushing to GitHub

### Test Resolution Strategy
When tests fail, **NEVER** force them to pass through inappropriate means:
1. **First**: Evaluate if the test is actually useful and testing real behavior
2. **Second**: Understand the root cause of the failure
3. **Finally**: Fix the actual problem, not the test
- **NEVER** mock away problems to make tests pass
- **NEVER** use lazy fallbacks that hide real issues
- **NEVER** skip tests without proper documentation

## SECURITY PRACTICES

- Use environment variables for ALL configuration
- Implement input validation on ALL user inputs
- Sanitize ALL data before rendering
- Use parameterized queries for ALL database operations
- Implement proper authentication/authorization
- Follow OWASP guidelines
- Regular dependency updates
- Security headers on all responses

## CODE QUALITY STANDARDS

- Clear, self-documenting code
- Meaningful variable names
- Consistent formatting
- Proper error handling
- Comprehensive logging (without secrets)
- Performance optimization
- Accessibility compliance
- Responsive design

## FAILURE CONSEQUENCES

Remember:
- Pushed secrets = Security breach
- Emojis in code = Unprofessional product
- Unverified code = Production failures
- Poor decisions = Technical debt
- Missing documentation = Future confusion
- Overengineering = Maintenance nightmare and wasted time

## SUCCESS CRITERIA

Every piece of code must be:
- Simple (as simple as possible, but no simpler)
- Secure
- Tested
- Documented
- Performant
- Maintainable
- Accessible
- Professional

---

**THESE RULES ARE NON-NEGOTIABLE. FAILURE IS NOT AN OPTION.**

**CHECK THIS FILE BEFORE EVERY WORK SESSION**

**SKIPPING ANY OF THESE STEPS WILL RESULT IN UNFATHOMABLE SADNESS AND DISAPPOINTMENT**
