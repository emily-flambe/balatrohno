from workers import Response, WorkerEntrypoint
import json
from calculate import calculate_probability, count_matching_cards

def error_response(message, status=400):
    """Create error response with CORS headers."""
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    body = json.dumps({'error': message})
    return Response(body, status=status, headers=headers)

def success_response(probability):
    """Create success response with CORS headers."""
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    # Use more precision for very small probabilities
    if probability < 0.0001:
        percentage = f"{probability * 100:.6f}%"
    elif probability < 0.01:
        percentage = f"{probability * 100:.4f}%"
    else:
        percentage = f"{probability * 100:.2f}%"

    body = json.dumps({
        'probability': probability,
        'percentage': percentage
    })
    return Response(body, status=200, headers=headers)

class Default(WorkerEntrypoint):
    async def fetch(self, request, env, ctx):
        """Main request handler."""
        # Handle CORS preflight
        if request.method == 'OPTIONS':
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
            return Response('', status=204, headers=headers)

        # Handle API endpoint
        if '/api/calculate' in request.url:
            if request.method != 'POST':
                return error_response('Method Not Allowed', 405)

            try:
                # Parse request body
                body = await request.json()
                deck = body.get('deck', [])
                draw_count = body.get('drawCount')
                min_matches = body.get('minMatches')
                rank = body.get('rank')
                suit = body.get('suit')

                # Validate required fields
                if not all([deck, draw_count is not None, min_matches is not None, rank, suit]):
                    return error_response('Missing required fields')

                # Count matching cards
                matching_cards = count_matching_cards(deck, rank, suit)
                deck_size = len(deck)

                # Calculate probability
                probability = calculate_probability(deck_size, matching_cards, draw_count, min_matches)

                return success_response(probability)

            except ValueError as e:
                return error_response(str(e), 400)
            except Exception as e:
                return error_response(str(e), 500)

        # Serve static assets - handled automatically by [assets] configuration
        return await env.ASSETS.fetch(request)
