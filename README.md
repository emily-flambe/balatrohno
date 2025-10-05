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
- npm 10+
- wrangler CLI (`npm install -g wrangler`)

### Development

```bash
# Install dependencies
npm install

# Start dev servers (backend + frontend)
make dev

# Run tests
python3 worker/test_calculate.py
```

Open http://localhost:5173

### Deployment

```bash
# Deploy to Cloudflare Workers
make deploy
```

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS v4
- **Backend**: Cloudflare Workers + Python
- **Calculation**: Native hypergeometric distribution (no scipy - not supported in Cloudflare Workers)
- **Deployment**: Cloudflare Workers (free tier)

## Documentation

- **[METHODOLOGY.md](METHODOLOGY.md)** - How probability calculations work
- **[.project/](.project/)** - Implementation details, architecture, and development guidelines
- **[.project/setup.md](.project/setup.md)** - Detailed setup instructions

## License

MIT
