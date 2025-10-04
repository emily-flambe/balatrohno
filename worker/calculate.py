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
    """
    Calculate probability using hypergeometric distribution.

    Args:
        deck_size: Total cards in deck
        matching_cards: Number of cards matching search criteria
        draw_count: Number of cards to draw
        min_matches: Minimum number of matching cards needed

    Returns:
        Probability as float between 0 and 1
    """
    # Validate inputs
    error = validate_inputs(deck_size, matching_cards, draw_count, min_matches)
    if error:
        raise ValueError(error)

    # Handle edge case: impossible to get min_matches
    if matching_cards < min_matches:
        return 0.0

    # Handle edge case: guaranteed to get min_matches
    if matching_cards >= draw_count:
        return 1.0

    # Create hypergeometric distribution
    # M = deck_size, n = matching_cards, N = draw_count
    rv = hypergeom(M=deck_size, n=matching_cards, N=draw_count)

    if min_matches == 1:
        # P(X >= 1) = 1 - P(X = 0)
        return 1 - rv.pmf(0)
    else:
        # P(X >= min_matches) = 1 - P(X < min_matches) = 1 - P(X <= min_matches-1)
        return 1 - rv.cdf(min_matches - 1)
