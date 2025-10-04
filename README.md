# Balatro Card Probability Calculator

Quick probability calculator for Balatro players to use during active gameplay.

## What is This?

A web-based tool that calculates the probability of drawing specific cards from your current deck. Designed for Balatro players who want quick, accurate answers while playing.

## Who is This For?

**Balatro players only.** This is a companion tool for use during gameplay, not a general card game calculator or educational resource.

## Features

- Display and modify your deck (add/remove cards)
- Calculate probability of drawing cards by rank, suit, or color
- Fast calculations using hypergeometric distribution
- Works on desktop and mobile

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- npm 10+

### Setup

```bash
# Install dependencies
npm install
pip install -r python/requirements.txt

# Install wrangler CLI
npm install -g wrangler

# Start development
npm run dev                    # Terminal 1: Frontend
wrangler dev worker/index.py   # Terminal 2: Backend
```

Open http://localhost:5173

For detailed setup instructions, see [.project/setup.md](.project/setup.md).

## Usage

1. Start with a standard 52-card deck
2. Modify your deck to match your current game state
3. Enter your draw parameters
4. Get instant probability results

## Example Queries

- "What's the probability of drawing at least 1 Ace in 5 cards?"
- "What's the probability of drawing at least 2 Hearts in 7 cards?"
- "What's the probability of drawing at least 3 Red cards in 8 cards?"

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS v4
- **Backend**: Cloudflare Workers + Python 3.11+
- **Calculation**: scipy.stats.hypergeom
- **Deployment**: Cloudflare Workers

## Development

For implementation details, architecture, and development guidelines, see the [.project/](.project/) directory.

## Deployment

```bash
# Build and deploy to Cloudflare Workers
npm run build
wrangler deploy
```

## License

MIT

## Note

This is a simple MVP focused on core functionality. Keep it simple. Build what's needed, nothing more.
