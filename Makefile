.PHONY: dev deploy

dev:
	@echo "Checking for port conflicts..."
	@lsof -ti:8787 | xargs kill -9 2>/dev/null || true
	@lsof -ti:5173 | xargs kill -9 2>/dev/null || true
	@sleep 1
	@echo "Starting backend (wrangler dev)..."
	@wrangler dev &
	@sleep 3
	@echo "Starting frontend (npm run dev)..."
	@npm run dev

deploy:
	@echo "Building frontend..."
	@npm run build
	@echo "Deploying to Cloudflare Workers..."
	@wrangler deploy
