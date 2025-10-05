"""
Hypergeometric distribution probability calculations for card draws.

This module contains pure calculation logic separated from the Workers runtime,
making it testable in standard Python environments.
"""

import math


def binomial_coefficient(n, k):
    """Calculate binomial coefficient C(n, k) = n! / (k! * (n-k)!)"""
    if k < 0 or k > n:
        return 0
    if k == 0 or k == n:
        return 1
    k = min(k, n - k)
    result = 1
    for i in range(k):
        result = result * (n - i) // (i + 1)
    return result


def hypergeom_pmf(k, M, n, N):
    """
    Calculate probability mass function for hypergeometric distribution.
    P(X = k) = C(n, k) * C(M-n, N-k) / C(M, N)

    Args:
        k: number of observed successes
        M: population size (deck_size)
        n: number of success states in population (matching_cards)
        N: number of draws (draw_count)
    """
    numerator = binomial_coefficient(n, k) * binomial_coefficient(M - n, N - k)
    denominator = binomial_coefficient(M, N)
    if denominator == 0:
        return 0.0
    return numerator / denominator


def hypergeom_cdf(k, M, n, N):
    """
    Calculate cumulative distribution function for hypergeometric distribution.
    P(X <= k) = sum of P(X = i) for i = 0 to k

    Args:
        k: upper bound for cumulative probability
        M: population size (deck_size)
        n: number of success states in population (matching_cards)
        N: number of draws (draw_count)
    """
    cumulative = 0.0
    for i in range(int(k) + 1):
        cumulative += hypergeom_pmf(i, M, n, N)
    return cumulative


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

    # Probability is 0% if not enough matching cards exist
    if matching_cards < min_matches:
        return 0.0

    # Probability is 100% if impossible to avoid getting min_matches
    # This happens when there aren't enough non-matching cards to fill the draw
    # Example: 50 aces in 52 cards, draw 5, need 1 ace -> guaranteed
    non_matching_cards = deck_size - matching_cards
    if non_matching_cards < (draw_count - min_matches + 1):
        return 1.0

    # Calculate P(X >= min_matches) = 1 - P(X <= min_matches - 1)
    if min_matches == 1:
        # P(X >= 1) = 1 - P(X = 0)
        return 1 - hypergeom_pmf(0, deck_size, matching_cards, draw_count)
    else:
        # P(X >= min_matches) = 1 - P(X <= min_matches - 1)
        return 1 - hypergeom_cdf(min_matches - 1, deck_size, matching_cards, draw_count)


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
