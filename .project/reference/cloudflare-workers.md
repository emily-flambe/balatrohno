# Cloudflare Workers Reference

## Quick Reference

### Environment Variables & Secrets

#### .dev.vars File
- **Location**: Must be in same directory as `wrangler.toml` (project root)
- **Format**: Dotenv syntax (KEY=value)
- **Security**: Never commit to git, add to `.gitignore`
- **Loading**: Automatically loaded by `wrangler dev`
- **Environment-specific**: Can create `.dev.vars.<environment>` files

```bash
# .dev.vars example
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://api.your-app
AUTH0_ISSUER=https://your-tenant.us.auth0.com/
```

#### Production Secrets
```bash
# Set secret (hidden in dashboard after setting)
wrangler secret put SECRET_NAME

# List secrets
wrangler secret list

# Delete secret
wrangler secret delete SECRET_NAME
```

### Wrangler Commands

#### Development
```bash
# Start dev server (loads .dev.vars automatically)
wrangler dev

# Specify port
wrangler dev --port 8787

# Use specific environment
wrangler dev --env staging

# Pass variables directly (not recommended)
wrangler dev --var KEY:value
```

#### Deployment
```bash
# Deploy to production
wrangler deploy

# Deploy to specific environment
wrangler deploy --env staging

# Deploy with specific compatibility date
wrangler deploy --compatibility-date 2025-01-01
```

#### Database (D1)
```bash
# Create database
wrangler d1 create DATABASE_NAME

# Execute SQL
wrangler d1 execute DATABASE_NAME --local --file=./schema.sql
wrangler d1 execute DATABASE_NAME --remote --file=./schema.sql

# Query database
wrangler d1 execute DATABASE_NAME --local --command="SELECT * FROM users"
```

### Bindings in wrangler.toml

```toml
# Basic configuration
name = "worker-name"
main = "worker/index.ts"
compatibility_date = "2025-01-01"

# Environment variables (public)
[vars]
PUBLIC_API_URL = "https://api.example.com"

# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "xxxx-xxxx-xxxx"

# KV Namespace
[[kv_namespaces]]
binding = "KV"
id = "xxxx-xxxx-xxxx"

# R2 Bucket
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "my-bucket"

# Durable Objects
[[durable_objects.bindings]]
name = "DO"
class_name = "MyDurableObject"
script_name = "worker"
```

### TypeScript Types

```typescript
// Env interface for bindings
interface Env {
  // Environment variables
  AUTH0_DOMAIN: string;
  AUTH0_AUDIENCE: string;

  // D1 Database
  DB: D1Database;

  // KV Namespace
  KV: KVNamespace;

  // R2 Bucket
  BUCKET: R2Bucket;

  // Durable Object
  DO: DurableObjectNamespace;
}

// Hono with Cloudflare Workers
import { Hono } from 'hono';

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => {
  // Access env variables
  const domain = c.env.AUTH0_DOMAIN;

  // Use D1
  const result = await c.env.DB.prepare('SELECT * FROM users').all();

  return c.json({ message: 'Hello World' });
});

export default app;
```

## Python Workers (Beta)

### Overview
Python Workers are currently in **open beta**. They allow running Python code on Cloudflare's edge network with support for most Python standard library and PyPI packages.

### Setup Requirements

#### 1. Enable Python Workers
Add compatibility flag to `wrangler.toml`:

```toml
name = "worker-name"
main = "worker/index.py"
compatibility_date = "2025-01-01"
compatibility_flags = ["python_workers"]

[build]
command = "npm run build"

[site]
bucket = "./dist"
```

#### 2. Create pyproject.toml
Define Python dependencies:

```toml
[project]
name = "worker-name"
version = "0.1.0"
requires-python = ">=3.11"

dependencies = [
    "scipy>=1.11.0",
    # Add other dependencies here
]
```

### Worker Structure

Minimal Python Worker:

```python
from workers import WorkerEntrypoint, Response

class Default(WorkerEntrypoint):
    async def fetch(self, request):
        return Response("Hello from Python!")
```

### Supported Packages

**Standard Library:** Most Python standard library modules are supported.

**PyPI Packages:** Pure Python packages and packages included in Pyodide.

**Pre-bundled Packages:**
- scipy
- numpy
- pandas
- FastAPI
- Langchain
- httpx
- And many more (see Cloudflare docs for full list)

### Package Management

**Option 1: pywrangler (Recommended)**
```bash
npm install -g pywrangler
```

Automatically bundles dependencies on deployment.

**Option 2: Standard wrangler**
Dependencies listed in `pyproject.toml` are bundled automatically.

### Development Workflow

```bash
# Start local development server
wrangler dev worker/index.py

# Deploy to production
wrangler deploy
```

### Python Worker Example with scipy

```python
from workers import WorkerEntrypoint, Response, Headers
from scipy.stats import hypergeom
import json

class Default(WorkerEntrypoint):
    async def fetch(self, request):
        if request.url.endswith('/api/calculate'):
            return await self.calculate(request)

        return Response("Not Found", status=404)

    async def calculate(self, request):
        try:
            body = await request.json()

            # Extract parameters
            deck_size = body['deckSize']
            matching = body['matchingCards']
            draw_count = body['drawCount']
            min_matches = body['minMatches']

            # Calculate probability using hypergeometric distribution
            prob = 1 - hypergeom.cdf(
                min_matches - 1,
                deck_size,
                matching,
                draw_count
            )

            # Return JSON response
            return Response(
                json.dumps({
                    'probability': float(prob),
                    'percentage': f'{prob * 100:.1f}%'
                }),
                headers=Headers({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                })
            )

        except Exception as e:
            return Response(
                json.dumps({'error': str(e)}),
                status=500,
                headers=Headers({'Content-Type': 'application/json'})
            )
```

### Environment Variables & Bindings

Python Workers support all Cloudflare bindings:
- Workers AI
- Vectorize
- R2
- KV
- D1
- Queues
- Durable Objects
- Service Bindings

Access via request context:

```python
class Default(WorkerEntrypoint):
    async def fetch(self, request):
        # Access environment variable
        api_key = self.env.API_KEY

        # Access KV namespace
        value = await self.env.KV.get("key")

        # Access D1 database
        result = await self.env.DB.prepare("SELECT * FROM users").all()

        return Response("Success")
```

### JavaScript Interoperability (FFI)

Call JavaScript from Python:

```python
from js import console, fetch as js_fetch

# Use JavaScript console
console.log("Hello from Python")

# Use JavaScript fetch
response = await js_fetch("https://api.example.com")
data = await response.json()
```

### Limitations

- Same runtime limits as TypeScript Workers
- 128MB memory limit
- 10ms CPU time limit (50ms for paid plans)
- No filesystem access
- Web APIs only (no Node.js APIs)

### Community & Support

Join `#python-workers` channel in Cloudflare Developers Discord for feedback and support.

### Documentation

- **Python Workers**: https://developers.cloudflare.com/workers/languages/python/
- **Supported Packages**: https://developers.cloudflare.com/workers/languages/python/packages/
- **Examples**: https://github.com/cloudflare/python-workers-examples

## Key Concepts

### Workers vs Pages Functions
- **Workers**: Full control, custom routing, more complex applications
- **Pages**: Static site hosting with serverless functions, simpler deployment

### Edge Runtime Limitations
- No Node.js APIs (use Web APIs instead)
- 128MB memory limit
- 10ms CPU time limit (50ms for paid plans)
- No filesystem access
- Use compatible libraries (e.g., `jose` instead of `jsonwebtoken`)

### Security Best Practices
1. **Never hardcode secrets** - Use environment variables or wrangler secrets
2. **Use .dev.vars for local development** - Never commit to git
3. **Validate all inputs** - Workers are exposed to the internet
4. **Use Web Crypto API** - For cryptographic operations
5. **Implement rate limiting** - Protect against abuse
6. **CORS configuration** - Configure appropriately for your use case

### Performance Optimization
1. **Cache responses** - Use Cache API or KV for static content
2. **Minimize cold starts** - Keep worker code small
3. **Use Durable Objects** - For stateful applications
4. **Batch operations** - Reduce round trips
5. **Use HTMLRewriter** - For HTML transformations

## Common Patterns

### JWT Verification (using jose)
```typescript
import { jwtVerify, createRemoteJWKSet } from 'jose';

const jwks = createRemoteJWKSet(new URL(`https://${domain}/.well-known/jwks.json`));

const { payload } = await jwtVerify(token, jwks, {
  issuer: expectedIssuer,
  audience: expectedAudience,
});
```

### Rate Limiting
```typescript
// Simple in-memory rate limiting
const requestCounts = new Map();

function rateLimit(ip: string, limit: number, window: number) {
  const now = Date.now();
  const count = requestCounts.get(ip) || { count: 0, resetTime: now + window };

  if (count.resetTime < now) {
    count.count = 0;
    count.resetTime = now + window;
  }

  count.count++;
  requestCounts.set(ip, count);

  return count.count <= limit;
}
```

### Error Handling
```typescript
export async function handleRequest(request: Request, env: Env) {
  try {
    // Your logic here
    return new Response('Success');
  } catch (error) {
    console.error('Error:', error);

    // Don't expose internal errors
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

## Documentation URLs

### Official Documentation
- **Workers Docs**: https://developers.cloudflare.com/workers/
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/
- **Environment Variables**: https://developers.cloudflare.com/workers/configuration/environment-variables/
- **Secrets Management**: https://developers.cloudflare.com/workers/configuration/secrets/
- **Wrangler Configuration**: https://developers.cloudflare.com/workers/wrangler/configuration/
- **System Environment Variables**: https://developers.cloudflare.com/workers/wrangler/system-environment-variables/

### API References
- **Runtime APIs**: https://developers.cloudflare.com/workers/runtime-apis/
- **Web Standards**: https://developers.cloudflare.com/workers/runtime-apis/web-standards/
- **Cloudflare-specific APIs**: https://developers.cloudflare.com/workers/runtime-apis/cloudflare-apis/

### Bindings Documentation
- **D1 Database**: https://developers.cloudflare.com/d1/
- **KV Storage**: https://developers.cloudflare.com/kv/
- **R2 Storage**: https://developers.cloudflare.com/r2/
- **Durable Objects**: https://developers.cloudflare.com/durable-objects/
- **Queues**: https://developers.cloudflare.com/queues/
- **Hyperdrive**: https://developers.cloudflare.com/hyperdrive/

### Development & Testing
- **Local Development**: https://developers.cloudflare.com/workers/testing/local-development/
- **Debugging**: https://developers.cloudflare.com/workers/testing/debugging/
- **Testing**: https://developers.cloudflare.com/workers/testing/
- **CI/CD**: https://developers.cloudflare.com/workers/ci-cd/

### Best Practices & Examples
- **Examples Repository**: https://github.com/cloudflare/workers-examples
- **Templates**: https://developers.cloudflare.com/workers/templates/
- **Tutorials**: https://developers.cloudflare.com/workers/tutorials/
- **Best Practices**: https://developers.cloudflare.com/workers/best-practices/

### Framework Integration
- **Hono**: https://hono.dev/getting-started/cloudflare-workers
- **Remix**: https://developers.cloudflare.com/pages/framework-guides/remix/
- **Next.js**: https://developers.cloudflare.com/pages/framework-guides/nextjs/
- **SvelteKit**: https://developers.cloudflare.com/pages/framework-guides/sveltekit/

### Troubleshooting
- **Known Issues**: https://developers.cloudflare.com/workers/known-issues/
- **Limits**: https://developers.cloudflare.com/workers/platform/limits/
- **Pricing**: https://developers.cloudflare.com/workers/platform/pricing/

## Quick Troubleshooting

### .dev.vars not loading
- Ensure file is in same directory as wrangler.toml
- Check file permissions
- Use `.dev.vars` not `.env` (or configure properly)
- Don't use both `.dev.vars` and `.env`

### CORS issues
- Set appropriate headers in worker response
- Check origin validation logic
- Ensure preflight requests are handled

### JWT verification fails
- Verify issuer URL includes trailing slash if needed
- Check audience matches exactly
- Ensure token hasn't expired
- Verify JWKS endpoint is accessible

### Deployment fails
- Check wrangler.toml syntax
- Verify all environment variables are set
- Check account limits and quotas
- Ensure compatibility date is valid

## Useful Commands Cheatsheet

```bash
# Login to Cloudflare
wrangler login

# Initialize new project
npm create cloudflare@latest

# Check configuration
wrangler whoami

# Tail logs (production)
wrangler tail

# Tail logs (specific environment)
wrangler tail --env staging

# List all workers
wrangler list

# Delete a worker
wrangler delete [worker-name]

# Check types
wrangler types

# Generate types for bindings
wrangler types --env-interface Env
```