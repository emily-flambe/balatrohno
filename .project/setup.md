# Setup and Configuration Guide

## Prerequisites

### Required Software

```bash
# Node.js 20+ (LTS)
node --version  # Should be v20.x.x or higher

# npm 10+
npm --version  # Should be 10.x.x or higher

# Python 3.11+ (for calculation engine)
python3 --version  # Should be 3.11.x or higher

# Wrangler CLI (for Cloudflare Workers)
npm install -g wrangler
```

### Cloudflare Account

1. Sign up at cloudflare.com (free tier is fine)
2. Get your account ID from dashboard
3. Create API token with Workers permissions

## Initial Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd balatro-probability-calculator

# Install frontend dependencies
npm install

# Install Python dependencies
pip install -r python/requirements.txt
```

### 2. Project Configuration

#### package.json

```json
{
  "name": "balatro-probability-calculator",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && wrangler deploy"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}
```

#### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true
      }
    }
  }
})
```

#### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### wrangler.toml

```toml
name = "balatrohno"
main = "worker/index.py"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"

[site]
bucket = "./dist"
```

#### python/requirements.txt

```
scipy>=1.11.0
```

## Development Workflow

### Start Development Servers

```bash
# Terminal 1: Frontend (port 5173)
npm run dev

# Terminal 2: Worker (port 8787)
wrangler dev worker/index.py
```

Frontend will proxy `/api` requests to Wrangler dev server.

### Making Changes

**Frontend changes:**
- Edit files in `src/`
- Hot reload updates automatically
- No restart needed

**Backend changes:**
- Edit `worker/index.py`
- Wrangler auto-reloads
- No restart needed

**Python calculation changes:**
- Wrangler picks up changes automatically

## Building for Production

### Build Command

```bash
npm run build
```

This:
1. Runs Vite build
2. Outputs to `dist/`
3. Ready for deployment

### Verify Build

```bash
npm run preview
```

Serves production build locally on port 4173.

## Deployment

### First-Time Setup

```bash
# Authenticate with Cloudflare
wrangler login

# Set account ID (from Cloudflare dashboard)
wrangler whoami
```

### Deploy to Production

```bash
npm run deploy
```

Or manually:

```bash
npm run build
wrangler deploy
```

### Deployment Checklist

Before deploying:
- [ ] Code builds without errors
- [ ] Manual testing completed
- [ ] No console errors in browser
- [ ] Calculation returns correct results
- [ ] Works on mobile (test with DevTools)

## Environment Configuration

### Development

No environment variables needed for MVP.

### Production

No secrets or API keys needed.

## Troubleshooting

### Frontend Won't Start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be v20+
```

### Backend Won't Start

```bash
# Check Python version
python3 --version  # Should be 3.11+

# Reinstall scipy
pip install --upgrade scipy

# Check Wrangler installation
wrangler --version
npm install -g wrangler@latest
```

### API Calls Failing

**In development:**
- Check both terminals are running
- Verify frontend is on :5173
- Verify worker is on :8787
- Check browser console for CORS errors

**In production:**
- Check Cloudflare Workers dashboard for errors
- View logs: `wrangler tail`
- Check deployment succeeded

### Build Errors

```bash
# Clear build cache
rm -rf dist .vite

# Try build again
npm run build
```

### Python Import Errors

```bash
# Verify scipy installed
python3 -c "import scipy; print(scipy.__version__)"

# If error, reinstall
pip install --force-reinstall scipy
```

## File Structure Reference

```
balatro-probability-calculator/
├── src/
│   ├── components/      # React components
│   ├── lib/            # Utilities and types
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── worker/
│   └── index.py        # Cloudflare Worker + Python
├── python/
│   └── requirements.txt
├── public/             # Static assets
├── dist/               # Build output (gitignored)
├── node_modules/       # Dependencies (gitignored)
├── package.json
├── vite.config.ts
├── tsconfig.json
├── wrangler.toml
└── README.md
```

## Common Commands

```bash
# Development
npm run dev              # Start frontend dev server
wrangler dev worker/index.py  # Start worker dev server

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Deployment
npm run deploy          # Build and deploy to Cloudflare

# Utilities
wrangler tail           # View production logs
wrangler whoami         # Check Cloudflare account
```

## Next Steps

After setup:

1. **Verify everything works:**
   - Open http://localhost:5173
   - See 52 cards
   - Remove a card
   - Add a card
   - Run a calculation
   - Get a probability result

2. **Start development:**
   - Follow `.project/roadmap.md` for implementation plan
   - Refer to `.project/frontend-spec.md` for component specs
   - Check `.project/backend-spec.md` for API details

3. **When ready to deploy:**
   - Run `npm run build` to verify
   - Run `npm run deploy`
   - Share URL with Balatro community

## Getting Help

**Vite issues:** https://vitejs.dev/guide/troubleshooting.html
**Wrangler issues:** https://developers.cloudflare.com/workers/
**React issues:** https://react.dev/learn
**scipy issues:** https://docs.scipy.org/doc/scipy/

## Summary

**Setup steps:**
1. Install Node 20+, Python 3.11+, Wrangler
2. Run `npm install`
3. Run `pip install -r python/requirements.txt`
4. Run `npm run dev` and `wrangler dev` in separate terminals
5. Open http://localhost:5173

**Deploy steps:**
1. Run `npm run build`
2. Run `wrangler deploy`
3. Done

Keep it simple. Don't overcomplicate the setup.
