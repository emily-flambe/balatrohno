# Backend/API Specification

## Guiding Principle

**ONE ENDPOINT. THAT'S IT.**

The backend has one job: receive deck + query, calculate probability, return number.

## API Endpoint

### POST /api/calculate

**That's the only endpoint we need.**

#### Request

```json
{
  "deck": [
    { "rank": "A", "suit": "hearts" },
    { "rank": "K", "suit": "spades" }
  ],
  "drawCount": 5,
  "minMatches": 1,
  "searchType": "rank",
  "searchValue": "A"
}
```

#### Response (Success)

```json
{
  "probability": 0.342,
  "percentage": "34.2%"
}
```

#### Response (Error)

```json
{
  "error": "Cannot draw more cards than exist in deck"
}
```

**Simple JSON in, simple JSON out.**

## Python Worker Implementation

### worker/index.py

```python
from js import Response, Headers
import json
from scipy.stats import hypergeom

async def on_fetch(request):
    """Handle all requests"""
    if request.url.endswith('/api/calculate'):
        return await calculate(request)

    return Response.new("Not Found", status=404)

async def calculate(request):
    """Calculate probability"""
    try:
        body = await request.json()

        # Extract data
        deck = body['deck']
        draw_count = body['drawCount']
        min_matches = body['minMatches']
        search_type = body['searchType']
        search_value = body['searchValue']

        # Validate
        error = validate(deck, draw_count, min_matches)
        if error:
            return error_response(error, 400)

        # Count matching cards
        matching = count_matches(deck, search_type, search_value)

        # Calculate probability
        prob = calculate_probability(
            len(deck),
            matching,
            draw_count,
            min_matches
        )

        # Return result
        return json_response({
            'probability': prob,
            'percentage': f'{prob * 100:.1f}%'
        })

    except Exception as e:
        return error_response(str(e), 500)

def validate(deck, draw_count, min_matches):
    """Return error message or None"""
    if draw_count < 1:
        return 'Draw count must be at least 1'
    if draw_count > len(deck):
        return 'Cannot draw more cards than exist in deck'
    if min_matches < 1:
        return 'Minimum matches must be at least 1'
    if min_matches > draw_count:
        return 'Minimum matches cannot exceed draw count'
    return None

def count_matches(deck, search_type, search_value):
    """Count how many cards match the criteria"""
    if search_type == 'rank':
        return sum(1 for card in deck if card['rank'] == search_value)

    if search_type == 'suit':
        return sum(1 for card in deck if card['suit'] == search_value)

    if search_type == 'color':
        red_suits = ['hearts', 'diamonds']
        black_suits = ['clubs', 'spades']

        if search_value == 'red':
            return sum(1 for card in deck if card['suit'] in red_suits)
        if search_value == 'black':
            return sum(1 for card in deck if card['suit'] in black_suits)

    return 0

def calculate_probability(deck_size, matching_cards, draw_count, min_matches):
    """
    Calculate probability using hypergeometric distribution

    P(X >= min_matches) where X ~ Hypergeom(deck_size, matching_cards, draw_count)
    """
    if min_matches == 1:
        # P(X >= 1) = 1 - P(X = 0)
        return 1 - hypergeom.pmf(0, deck_size, matching_cards, draw_count)

    # P(X >= k) = sum of P(X = i) for i = k to max
    max_possible = min(draw_count, matching_cards)
    total = 0

    for i in range(min_matches, max_possible + 1):
        total += hypergeom.pmf(i, deck_size, matching_cards, draw_count)

    return total

def json_response(data, status=200):
    """Helper to create JSON response"""
    return Response.new(
        json.dumps(data),
        status=status,
        headers=Headers.new({'Content-Type': 'application/json'})
    )

def error_response(message, status=500):
    """Helper to create error response"""
    return json_response({'error': message}, status)
```

**Everything in one file. ~100 lines total. No modules, no classes, no abstractions.**

## Dependencies

### Python Packages

```
scipy  # For hypergeom.pmf
```

**That's it. One dependency.**

## Cloudflare Workers Setup

### wrangler.toml

```toml
name = "balatrohno"
main = "worker/index.py"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"
```

**Minimal configuration. Frontend assets served from ./dist, Python worker handles /api/calculate.**

## Error Handling Strategy

### Validation Errors (400)

- Draw count < 1
- Draw count > deck size
- Min matches < 1
- Min matches > draw count
- Invalid search type

**Return clear error message. That's all.**

### Server Errors (500)

- Calculation fails
- Unexpected exception

**Log the error, return generic message to user.**

```python
except Exception as e:
    print(f"Error: {e}")  # Logs in Wrangler
    return error_response("Calculation failed", 500)
```

## Development Workflow

### Local Development

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Worker
wrangler dev worker/index.py
```

**Frontend proxies /api requests to Wrangler dev server. Simple.**

### Testing

```bash
# Test the endpoint directly
curl -X POST http://localhost:8787/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "deck": [{"rank":"A","suit":"hearts"}],
    "drawCount": 1,
    "minMatches": 1,
    "searchType": "rank",
    "searchValue": "A"
  }'
```

**Manual testing with curl. No test framework needed for one endpoint.**

## Deployment

```bash
npm run build  # Build frontend to dist/
wrangler deploy  # Deploy everything to Cloudflare
```

**One command deploys both frontend and backend.**

## What We're NOT Building

### Don't Add These

- Authentication
- Rate limiting (Cloudflare handles basic protection)
- Logging system (console.log is fine)
- Database
- Caching layer
- Multiple endpoints
- Versioning (/api/v1/)
- GraphQL
- WebSockets
- Background jobs
- Microservices

**Keep it simple. One stateless endpoint.**

## Performance Considerations

### Current Approach

- Stateless computation
- No database queries
- Fast math (scipy)
- Edge deployment

**Should be fast enough. Don't optimize until you measure a problem.**

### If Performance Becomes an Issue

1. **Profile first**: Measure where time is spent
2. **Optimize the slow part**: Usually the math, not the API layer
3. **Consider caching**: Only if same calculation requested frequently

**Don't add caching, Redis, CDN layers, etc. until you have evidence you need them.**

## Security

### Input Validation

**Already doing:**
- Validate draw count
- Validate min matches
- Validate search type

**That's sufficient for MVP.**

### Don't Worry About (Yet)

- SQL injection (no database)
- XSS (returning JSON numbers, not HTML)
- CSRF (no authentication, no state)
- Rate limiting (start with Cloudflare defaults)

## CORS

### Simple CORS Headers

```python
headers=Headers.new({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'  # Allow all origins for MVP
})
```

**Open CORS for MVP. Restrict later if needed.**

## Monitoring

### What to Monitor

- Error rate (Cloudflare dashboard)
- Request count (Cloudflare dashboard)
- Response time (Cloudflare dashboard)

**Cloudflare provides basic monitoring. Don't add Sentry, DataDog, etc. unless errors become a problem.**

## File Structure

```
worker/
└── index.py  # Everything in one file
```

**No need for multiple files. ~100 lines of code total.**

## Anti-Patterns to Avoid

### Don't Do This

```python
# ❌ Overengineered structure
worker/
├── __init__.py
├── routes/
│   ├── __init__.py
│   └── calculate.py
├── services/
│   ├── __init__.py
│   └── probability_service.py
├── models/
│   ├── __init__.py
│   ├── card.py
│   └── calculation_request.py
├── utils/
│   ├── __init__.py
│   ├── validators.py
│   └── helpers.py
└── config/
    ├── __init__.py
    └── settings.py

# ❌ Unnecessary abstraction
class ProbabilityCalculator:
    def __init__(self, deck, strategy):
        self.deck = deck
        self.strategy = strategy

    def calculate(self):
        return self.strategy.execute(self.deck)

# ❌ Over-the-top error handling
try:
    result = calculate()
except CalculationError as e:
    logger.error("Calculation failed", exc_info=True)
    metrics.increment("calculation_errors")
    sentry.capture_exception(e)
    return error_response(e)
except ValidationError as e:
    logger.warning("Validation failed", extra={"request": request})
    return error_response(e)
```

### Do This Instead

```python
# ✅ Simple, direct, one file
async def calculate(request):
    try:
        # ... do the calculation
        return json_response(result)
    except Exception as e:
        print(f"Error: {e}")
        return error_response(str(e), 500)
```

## Summary

**Backend principle: One endpoint, one file, one job.**

- POST /api/calculate
- Validate input
- Count matching cards
- Calculate probability
- Return JSON

Everything else is unnecessary for MVP.
