# Project Overview - Balatro Card Probability Calculator

## Vision

**Build a web-based card probability calculator** inspired by the game Balatro that helps players understand the mathematical probability of drawing specific cards from customizable decks. This tool empowers players to make informed strategic decisions by providing accurate, real-time probability calculations.

## Mission Statement

Provide players with a **production-ready probability calculator** that includes:

- **Interactive deck management** with visual card display
- **Accurate probability calculations** using hypergeometric distribution
- **Intuitive user interface** inspired by Balatro's visual design
- **Fast, responsive performance** with instant calculation results
- **Modern web technologies** ensuring reliability and maintainability
- **Extensible architecture** for future enhancements and features

## Core Goals

### 1. Simplicity and Usability
- **Instant Understanding**: Users immediately grasp how to use the tool
- **Visual Clarity**: Card deck displayed clearly with Balatro-style aesthetics
- **Minimal Clicks**: Accomplish tasks with minimum user interaction
- **Clear Feedback**: Results presented in understandable, actionable format

### 2. Mathematical Accuracy
- **Correct Calculations**: 100% accurate probability calculations using established mathematical formulas
- **Edge Case Handling**: Proper validation and handling of all input scenarios
- **Transparent Methods**: Clear indication of calculation methodology used
- **Verifiable Results**: Results can be verified against manual calculations

### 3. Performance Excellence
- **Instant Calculations**: Sub-100ms calculation response times
- **Responsive UI**: Smooth interactions even with large decks (200+ cards)
- **Fast Loading**: Quick initial page load and minimal bundle size
- **Efficient Updates**: Real-time UI updates without lag

### 4. Extensibility
- **Modular Architecture**: Clean separation of concerns for easy feature additions
- **Type Safety**: Full TypeScript coverage for maintainability
- **Platform Agnostic**: Can be deployed to multiple platforms without major changes
- **Future-Ready**: Architecture supports advanced features without refactoring

## Target Users

### Primary Audience
- **Balatro players** actively playing the game who need quick probability calculations during gameplay
- Players want to check odds **while playing** to make informed strategic decisions in real-time

### Use Case
This is a **companion tool for active gameplay**, not an educational resource or general card game calculator. Players will:
- Have the calculator open while playing Balatro
- Quickly check probabilities for their current deck state
- Make immediate strategic decisions based on the results
- Return to the game within seconds

### Skill Level Expectations
- **Balatro players only**: Assumes familiarity with the game
- **No math knowledge required**: Just enter your deck and get instant answers
- **Speed is critical**: Must be faster than doing mental math or opening a spreadsheet

## Success Metrics

### Technical Excellence
- **Calculation Accuracy**: 100% correct probability calculations
- **Performance**: <100ms response time for all calculations
- **Bundle Size**: <500KB initial bundle for fast loading
- **Browser Compatibility**: Works in all modern browsers
- **Type Safety**: 100% TypeScript coverage with strict mode

### User Experience
- **Ease of Use**: Users can complete first calculation within 30 seconds
- **Visual Clarity**: Deck state always clearly visible and understandable
- **Error Prevention**: Invalid inputs prevented or clearly indicated
- **Helpful Feedback**: Clear error messages and calculation explanations

## Key Features

### MVP Feature Set

#### 1. Standard Deck Initialization
- Start with standard 52-card deck (13 ranks x 4 suits)
- Clear visual representation of all cards
- Total card count prominently displayed

#### 2. Deck Editing
- **Add Cards**: Add duplicate or new cards to deck
- **Modify Cards**: Change rank and/or suit of existing cards
- **Delete Cards**: Remove specific cards from deck
- **Visual Selection**: Click/tap to select cards for operations

#### 3. Probability Calculator
- **Draw Count (N)**: Specify number of cards to draw
- **Match Threshold**: Define "at least X matching cards" requirement
- **Search Criteria**: Find cards by rank, suit, or color
- **Result Display**: Show probability as percentage with clear explanation

#### 4. Visual Deck Display
- **Balatro-Style UI**: Cards displayed in familiar grid/collection view
- **Selection Feedback**: Visual indication of selected cards
- **Responsive Layout**: Works on desktop and mobile devices
- **Card Previews**: Clear, readable card displays

### Calculation Capabilities

#### Supported Query Types (MVP)
- **By Rank**: "At least 2 Jacks in 5 cards"
- **By Suit**: "At least 1 Heart in 7 cards"
- **By Color**: "At least 3 Red cards in 8 cards"

#### Mathematical Foundation
- **Hypergeometric Distribution**: Industry-standard probability formula for drawing without replacement
- **Complementary Probability**: Efficient calculation for "at least N" queries
- **Edge Case Validation**: Prevents invalid queries (e.g., drawing more cards than deck contains)

## Key Differentiators

### Balatro-Inspired Design
- **Visual Familiarity**: Interface matches Balatro's card display aesthetics
- **Game-Relevant Context**: Designed for Balatro players' specific use cases
- **Strategic Focus**: Emphasizes decision-making and strategy optimization

### Technical Excellence
- **Modern Stack**: React + TypeScript + Vite for best-in-class developer and user experience
- **Dual Language**: TypeScript frontend with Python calculation engine
- **Edge Deployment**: Cloudflare Workers for global performance
- **Type Safety**: End-to-end type safety from UI to calculations

### Accuracy and Reliability
- **Proven Mathematics**: Uses established hypergeometric distribution formula
- **Comprehensive Testing**: Extensive test coverage for calculation accuracy
- **Edge Case Handling**: Robust validation prevents calculation errors
- **Transparent Results**: Clear explanation of what's being calculated

## Non-Goals

### What We Don't Build (MVP)
- **Deck Persistence**: No save/load custom decks (future enhancement)
- **Complex Queries**: No compound queries like "2 Jacks OR 1 Ace" (future enhancement)
- **Probability Distributions**: No visualization of full distribution curves (future enhancement)
- **Jokers and Special Cards**: No Balatro-specific special card types (future enhancement)
- **Multi-Deck Analysis**: No comparing multiple deck configurations (future enhancement)
- **Expected Value Calculations**: No scoring or value calculations (future enhancement)
- **Historical Tracking**: No undo/redo or deck history (future enhancement)

### Complexity We Avoid
- **Over-Engineering**: Keep MVP focused on core functionality
- **Premature Optimization**: Focus on correctness first, then performance
- **Feature Creep**: Resist adding non-essential features to MVP
- **Complex UI**: Maintain simplicity and clarity in interface design

## Implementation Phases

### Phase 1: MVP Foundation (Current Scope)
- Standard 52-card deck initialization
- Basic deck editing (add, modify, delete cards)
- Balatro-style visual deck display
- Single probability calculator with rank, suit, color queries
- Hypergeometric distribution calculation engine
- TypeScript frontend + Python backend integration
- Cloudflare Workers deployment

### Phase 2: Enhanced Usability (Future)
- Deck templates (standard poker, custom game decks)
- Save/load custom deck configurations
- Calculation history with recent queries
- Mobile-optimized touch interactions
- Keyboard shortcuts for power users

### Phase 3: Advanced Features (Future)
- Balatro-specific cards (Jokers, special cards, enhancements)
- Complex compound queries ("X Jacks OR Y Hearts")
- Probability distribution visualizations (charts, graphs)
- Expected value calculations based on scoring rules
- Multiple simultaneous probability comparisons

### Phase 4: Community Features (Future)
- Share deck configurations via URL
- Community deck library
- Strategy guides integration
- Probability presets for common scenarios
- Export calculation results

## Long-term Vision

### Balatro Integration
- **Go-to companion tool**: The tool Balatro players keep open during gameplay
- **Community adoption**: Shared in Discord servers and strategy discussions
- **Speed and reliability**: Fast enough that it never slows down gameplay

### Gameplay Enhancement
- **Better decision-making**: Help players make optimal strategic choices in real-time
- **Confidence in plays**: Remove uncertainty about probability-based decisions
- **Faster learning**: New players learn deck probabilities through use

This card probability calculator aims to become the **essential companion tool** for Balatro players who want quick, accurate probability answers during active gameplay.
