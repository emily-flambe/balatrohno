from js import Response, Headers
import json
from scipy.stats import hypergeom

def validate_inputs(deck_size, matching_cards, draw_count, min_matches):
    """Validate calculation inputs and return error message if invalid."""
    if deck_size < 1:
        return "Deck size must be at least 1"
    if matching_cards > deck_size:
        return "Number of matching cards cannot exceed deck size"
    if draw_count > deck_size:
        return "Draw count cannot exceed deck size"
    if min_matches > draw_count:
        return "Minimum matches cannot exceed draw count"
    if min_matches < 1:
        return "Minimum matches must be at least 1"
    return None

def calculate_probability(deck_size, matching_cards, draw_count, min_matches):
    """Calculate probability using hypergeometric distribution."""
    error = validate_inputs(deck_size, matching_cards, draw_count, min_matches)
    if error:
        raise ValueError(error)

    if matching_cards < min_matches:
        return 0.0
    if matching_cards >= draw_count:
        return 1.0

    rv = hypergeom(M=deck_size, n=matching_cards, N=draw_count)

    if min_matches == 1:
        return 1 - rv.pmf(0)
    else:
        return 1 - rv.cdf(min_matches - 1)

def count_matching_cards(deck, search_type, search_value):
    """Count cards matching search criteria."""
    count = 0
    for card in deck:
        if search_type == 'rank':
            if card['rank'] == search_value:
                count += 1
        elif search_type == 'suit':
            if card['suit'] == search_value:
                count += 1
        elif search_type == 'color':
            card_color = 'red' if card['suit'] in ['hearts', 'diamonds'] else 'black'
            if card_color == search_value:
                count += 1
    return count

def error_response(message, status=400):
    """Create error response with CORS headers."""
    headers = Headers.new({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }.items())
    body = json.dumps({'error': message})
    return Response.new(body, status=status, headers=headers)

def success_response(probability):
    """Create success response with CORS headers."""
    headers = Headers.new({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }.items())
    percentage = f"{probability * 100:.2f}%"
    body = json.dumps({
        'probability': probability,
        'percentage': percentage
    })
    return Response.new(body, status=200, headers=headers)

async def on_fetch(request):
    """Main request handler."""
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        headers = Headers.new({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }.items())
        return Response.new('', status=204, headers=headers)

    # Only accept POST to /api/calculate
    if not request.url.endswith('/api/calculate'):
        return error_response('Not Found', 404)

    if request.method != 'POST':
        return error_response('Method Not Allowed', 405)

    try:
        # Parse request body
        body = await request.json()
        deck = body.get('deck', [])
        draw_count = body.get('drawCount')
        min_matches = body.get('minMatches')
        search_type = body.get('searchType')
        search_value = body.get('searchValue')

        # Validate required fields
        if not all([deck, draw_count is not None, min_matches is not None, search_type, search_value]):
            return error_response('Missing required fields')

        # Count matching cards
        matching_cards = count_matching_cards(deck, search_type, search_value)
        deck_size = len(deck)

        # Calculate probability
        probability = calculate_probability(deck_size, matching_cards, draw_count, min_matches)

        return success_response(probability)

    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response(str(e), 500)
