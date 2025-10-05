"""
Test cases for hypergeometric distribution probability calculations.

These tests verify the mathematical correctness of card draw probability calculations
using known hypergeometric distribution results.
"""

import sys
sys.path.insert(0, '.')

from calculate import (
    binomial_coefficient,
    hypergeom_pmf,
    hypergeom_cdf,
    calculate_probability,
    count_matching_cards
)


def test_binomial_coefficient():
    """Test binomial coefficient calculations."""
    assert binomial_coefficient(5, 0) == 1
    assert binomial_coefficient(5, 5) == 1
    assert binomial_coefficient(5, 2) == 10
    assert binomial_coefficient(52, 5) == 2598960
    assert binomial_coefficient(4, 2) == 6
    print("✓ Binomial coefficient tests passed")


def test_hypergeom_pmf():
    """Test hypergeometric probability mass function."""
    # Standard deck: 13 spades in 52 cards, draw 5, get exactly 2 spades
    # P(X = 2) ≈ 0.2743
    prob = hypergeom_pmf(2, 52, 13, 5)
    assert abs(prob - 0.2743) < 0.001, f"Expected ~0.2743, got {prob}"

    # P(X = 0) when drawing 1 ace from 52 cards (4 aces)
    # P(X = 0) = C(4,0) * C(48,1) / C(52,1) = 1 * 48 / 52 = 0.9231
    prob = hypergeom_pmf(0, 52, 4, 1)
    assert abs(prob - 0.9231) < 0.001, f"Expected ~0.9231, got {prob}"

    print("✓ Hypergeometric PMF tests passed")


def test_hypergeom_cdf():
    """Test hypergeometric cumulative distribution function."""
    # P(X <= 1) for 13 spades in 52 cards, draw 5
    prob = hypergeom_cdf(1, 52, 13, 5)
    # Should be P(X=0) + P(X=1)
    p0 = hypergeom_pmf(0, 52, 13, 5)
    p1 = hypergeom_pmf(1, 52, 13, 5)
    assert abs(prob - (p0 + p1)) < 0.0001, f"CDF mismatch: {prob} vs {p0 + p1}"

    print("✓ Hypergeometric CDF tests passed")


def test_calculate_probability_edge_cases():
    """Test edge cases for probability calculation."""
    # Case 1: Not enough matching cards - should be 0%
    prob = calculate_probability(deck_size=52, matching_cards=3, draw_count=5, min_matches=4)
    assert prob == 0.0, f"Expected 0%, got {prob * 100}%"

    # Case 2: Guaranteed to get matches - should be 100%
    # 50 aces in 52 cards, draw 5, need at least 1 ace
    # Only 2 non-aces, can't fill 5 cards without getting an ace
    prob = calculate_probability(deck_size=52, matching_cards=50, draw_count=5, min_matches=1)
    assert prob == 1.0, f"Expected 100%, got {prob * 100}%"

    # Case 3: NOT guaranteed despite having many matching cards
    # 5 aces in 52 cards, draw 5, need at least 1 ace
    # 47 non-aces exist, so could draw 5 non-aces
    prob = calculate_probability(deck_size=52, matching_cards=5, draw_count=5, min_matches=1)
    assert prob < 1.0, f"Expected <100%, got {prob * 100}%"
    assert prob > 0.0, f"Expected >0%, got {prob * 100}%"

    print("✓ Edge case tests passed")


def test_calculate_probability_known_results():
    """Test against known probability results."""
    # Standard deck: 4 aces in 52 cards, draw 5, at least 1 ace
    # P(at least 1 ace) = 1 - P(no aces)
    # P(no aces) = C(4,0) * C(48,5) / C(52,5) = C(48,5) / C(52,5)
    # P(at least 1 ace) ≈ 0.3412
    prob = calculate_probability(deck_size=52, matching_cards=4, draw_count=5, min_matches=1)
    assert abs(prob - 0.3412) < 0.001, f"Expected ~34.12%, got {prob * 100}%"

    # Standard deck: 13 hearts in 52 cards, draw 5, at least 2 hearts
    # P(at least 2 hearts) ≈ 0.3670
    prob = calculate_probability(deck_size=52, matching_cards=13, draw_count=5, min_matches=2)
    assert abs(prob - 0.3670) < 0.001, f"Expected ~36.70%, got {prob * 100}%"

    # Small deck: 3 aces in 10 cards, draw 4, at least 1 ace
    # P(at least 1 ace) = 1 - P(no aces)
    # P(no aces) = C(3,0) * C(7,4) / C(10,4) = 35/210 = 1/6
    # P(at least 1 ace) = 5/6 ≈ 0.8333
    prob = calculate_probability(deck_size=10, matching_cards=3, draw_count=4, min_matches=1)
    assert abs(prob - 0.8333) < 0.001, f"Expected ~83.33%, got {prob * 100}%"

    print("✓ Known result tests passed")


def test_count_matching_cards():
    """Test card counting logic."""
    deck = [
        {"rank": "A", "suit": "hearts"},
        {"rank": "A", "suit": "diamonds"},
        {"rank": "K", "suit": "hearts"},
        {"rank": "Q", "suit": "clubs"}
    ]

    # Count by rank only (any suit)
    assert count_matching_cards(deck, rank="A", suit="any") == 2
    assert count_matching_cards(deck, rank="K", suit="any") == 1
    assert count_matching_cards(deck, rank="J", suit="any") == 0

    # Count by suit only (any rank)
    assert count_matching_cards(deck, rank="any", suit="hearts") == 2
    assert count_matching_cards(deck, rank="any", suit="clubs") == 1
    assert count_matching_cards(deck, rank="any", suit="spades") == 0

    # Count by both rank and suit (specific card)
    assert count_matching_cards(deck, rank="A", suit="hearts") == 1
    assert count_matching_cards(deck, rank="A", suit="diamonds") == 1
    assert count_matching_cards(deck, rank="K", suit="hearts") == 1
    assert count_matching_cards(deck, rank="A", suit="clubs") == 0

    print("✓ Card counting tests passed")


def test_balatro_specific_scenarios():
    """Test scenarios specific to Balatro gameplay."""
    # Scenario 1: After discarding all aces, what's probability of drawing one in next hand?
    # Deck has 48 cards (52 - 4 aces), draw 8, no aces
    prob = calculate_probability(deck_size=48, matching_cards=0, draw_count=8, min_matches=1)
    assert prob == 0.0, "No aces left should give 0%"

    # Scenario 2: Modified deck with extra aces
    # 52 + 4 = 56 cards total, 8 aces, draw 5, need 2 aces
    prob = calculate_probability(deck_size=56, matching_cards=8, draw_count=5, min_matches=2)
    assert 0.0 < prob < 1.0, f"Probability should be between 0% and 100%, got {prob * 100}%"

    # Scenario 3: Very small deck (common late-game in Balatro)
    # 10 cards left, 3 are face cards, draw 3, need at least 1 face card
    prob = calculate_probability(deck_size=10, matching_cards=3, draw_count=3, min_matches=1)
    # P(at least 1) = 1 - P(none) = 1 - C(7,3)/C(10,3) = 1 - 35/120 = 85/120 ≈ 0.7083
    assert abs(prob - 0.7083) < 0.001, f"Expected ~70.83%, got {prob * 100}%"

    print("✓ Balatro-specific scenario tests passed")


if __name__ == "__main__":
    print("Running hypergeometric distribution tests...\n")

    test_binomial_coefficient()
    test_hypergeom_pmf()
    test_hypergeom_cdf()
    test_calculate_probability_edge_cases()
    test_calculate_probability_known_results()
    test_count_matching_cards()
    test_balatro_specific_scenarios()

    print("\n✓ All tests passed!")
