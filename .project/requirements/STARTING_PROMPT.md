# Card Probability Calculator - MVP Project Specification Request

## Project Overview

I need you to create a complete set of design and technical specification documents for building a web-based card probability calculator inspired by the game Balatro. This tool will help users understand the probability of drawing specific cards from a customizable deck.

## Core Functionality Requirements

### 1. Deck Management
- **Initial State**: The application should start with a standard 52-card deck (13 ranks × 4 suits: Hearts, Diamonds, Clubs, Spades)
- **Card Structure**: Each card has:
  - Rank: 2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, Ace
  - Suit: Hearts, Diamonds, Clubs, Spades
  - Visual representation (can be simple for MVP)

### 2. Deck Editing Capabilities
Users must be able to:
- **Add cards**: Add new cards to the deck (can be duplicates of existing cards or custom cards)
- **Modify cards**: Change the rank and/or suit of existing cards
- **Delete cards**: Remove specific cards from the deck
- **View current deck state**: See all cards currently in the deck with a clear count

### 3. Visual Deck Interface
- **Balatro-style card display**: Show all cards in the deck in a grid/collection view similar to how Balatro displays your deck
- **Card selection**: Users should be able to click/tap to select cards (for editing or deletion)
- **Visual feedback**: Selected cards should have clear visual indication
- **Deck statistics**: Display total card count prominently

### 4. Probability Calculator
The core calculation interface needs:

**Input Fields:**
- **N (Draw count)**: Number of cards the user will draw from the deck
- **At least count**: The minimum number of matching cards needed (e.g., "at least 1", "at least 2")
- **Search criteria**: What to search for (e.g., "Jack", "Hearts", "Red cards")

**Initial MVP Search Types:**
- By rank (e.g., "Jack", "Queen", "Ace")
- By suit (e.g., "Hearts", "Diamonds")
- By color (e.g., "Red", "Black")

**Output:**
- Display the probability as a percentage with clear formatting
- Show the calculation in a user-friendly way (e.g., "34.2% chance of drawing at least 1 Jack in 5 cards")

### 5. Mathematical Foundation
- Use **hypergeometric distribution** for probability calculations
- The formula calculates the probability of drawing k successes (matching cards) in n draws from a finite population without replacement
- For "at least N" queries, calculate using complementary probability when efficient

## Technical Requirements

### Technology Stack and Architecture

**Frontend:**
- **TypeScript** for type-safe frontend code
- **Vite** as the build tool and development server
- Modern web standards (HTML5, CSS3)
- Responsive design for mobile and desktop

**Backend/Calculation Engine:**
- **Python** for probability calculations (hypergeometric distribution)
- Python libraries: scipy.stats or custom implementation for hypergeometric calculations
- Expose Python calculations via API endpoints

**Deployment:**
- **Cloudflare Workers** for hosting and serverless execution
- Integration pattern that allows Python calculations to work within the Cloudflare Workers environment

**Reference Project:**
- **IMPORTANT**: Before creating any documents, examine the project structure at `~/Documents/Github/ddx-customer-dashboard-v2`
- Pay special attention to:
  - Overall project directory structure
  - How the `.project/` directory is organized
  - The structure and format of steering documents in `.project/`
  - How technical specifications are documented
  - How frontend and backend are organized
  - Configuration files (vite.config, tsconfig, etc.)
  - Any patterns for integrating different languages/technologies
- Use this as a template for how to structure this new project

### Technology Stack
**State Management:**
- Choose appropriate state management (React Context, Zustand, or similar)
- State should track: current deck composition, selected cards, calculator inputs, results

**Styling:**
- CSS Modules, Tailwind CSS, or styled-components (choose what fits best)
- Card-based UI inspired by Balatro's visual style
- Smooth animations for card interactions

## Deliverables Required

Please create the following documents in a `.project/` directory following the structure and format you observe in `~/Documents/Github/ddx-customer-dashboard-v2/.project/`:

### 1. Project Overview Document
**Filename**: `.project/overview.md`
- Executive summary of the project
- Key objectives and success criteria
- Target users and use cases
- High-level architecture diagram (in text/markdown)

### 2. Technical Architecture Document
**Filename**: `.project/architecture.md`
- Detailed system architecture
- Component breakdown (frontend components, backend services)
- Data flow diagrams
- Technology stack justification
- Integration between TypeScript frontend and Python backend
- Cloudflare Workers deployment architecture
- API design and endpoints

### 3. Database/State Schema Document
**Filename**: `.project/data-schema.md`
- Deck data structure
- Card data structure
- Application state shape
- Any persistent storage needs (localStorage, etc.)

### 4. Frontend Specification
**Filename**: `.project/frontend-spec.md`
- Component hierarchy and responsibilities
- UI/UX wireframes (described in text)
- User flows for key interactions:
  - Adding/editing/deleting cards
  - Selecting cards for calculation
  - Running probability calculations
- Responsive design considerations
- Accessibility requirements

### 5. Backend/API Specification
**Filename**: `.project/backend-spec.md`
- API endpoints specification
- Request/response formats
- Python calculation module design
- Error handling strategy
- Integration with Cloudflare Workers

### 6. Calculation Engine Specification
**Filename**: `.project/calculation-spec.md`
- Detailed explanation of hypergeometric distribution
- Algorithm implementation approach
- Edge cases and validation
- Performance considerations
- Test cases for probability calculations

### 7. Development Roadmap
**Filename**: `.project/roadmap.md`
- Phase 1: MVP features (break into implementable tasks)
- Phase 2: Future enhancements
- Testing strategy
- Deployment checklist

### 8. Setup and Configuration Guide
**Filename**: `.project/setup.md`
- Required dependencies
- Development environment setup
- Build and deployment scripts
- Environment variables and configuration

## Design Principles for MVP

1. **Simplicity First**: The MVP should be functional but minimal. No unnecessary features.
2. **Clear User Flow**: Each action should be intuitive and require minimal explanation.
3. **Accurate Calculations**: The probability calculations must be mathematically correct.
4. **Visual Clarity**: The deck view should make it easy to understand what cards are in the deck.
5. **Extensibility**: Code should be structured to easily add new features later (more search types, probability distributions, etc.)

## Constraints and Considerations

- **Performance**: Calculations should be fast even with large deck sizes (up to ~200 cards)
- **Validation**: Prevent invalid inputs (negative numbers, drawing more cards than exist in deck, etc.)
- **User Feedback**: Show loading states, error messages, and success confirmations
- **Browser Compatibility**: Support modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile Responsive**: Should work well on phone screens

## Future Enhancements (Document but Don't Implement)

These should be mentioned in the roadmap but are NOT part of the MVP:
- Saving/loading custom decks
- Multiple simultaneous probability queries
- More complex queries ("at least 2 Jacks OR at least 1 Ace")
- Probability distributions (not just single probability values)
- Deck templates for different card games
- Jokers and special cards from Balatro
- Expected value calculations
- Card history/undo functionality

## Your Task

1. **First**: Carefully examine the reference project at `~/Documents/Github/ddx-customer-dashboard-v2` to understand:
   - Directory structure conventions
   - Documentation style and format in `.project/`
   - How steering documents are written
   - Project organization patterns

2. **Then**: Create all the specification documents listed above in the `.project/` directory, following the patterns you observed in the reference project.

3. **Ensure**:
   - Documents are detailed enough that a developer could implement from them
   - Technical decisions are explained with rationale
   - All documents are consistent with each other
   - The Python + TypeScript + Vite + Cloudflare Workers stack is properly architected
   - The MVP scope is clearly defined and achievable

4. **Writing Style**:
   - Be specific and technical where needed
   - Use clear section headings
   - Include code examples or pseudocode where helpful
   - Cross-reference between documents when relevant
   - Match the tone and structure of the reference project's documentation

Please create these documents now, starting with examining the reference project structure.
