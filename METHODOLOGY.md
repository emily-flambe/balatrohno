# Probability Calculation Methodology

This document explains how card draw probabilities are calculated in the Balatro Card Probability Calculator.

## The Problem

Calculate the probability of drawing at least N specific cards when drawing X cards from a modified deck.

Example: "What is the probability of drawing at least 2 Aces when drawing 7 cards from my current deck?"

## The Solution: Hypergeometric Distribution

This is a classic hypergeometric distribution problem. The hypergeometric distribution models the probability of k successes in n draws from a finite population without replacement.

### Why Hypergeometric?

When you draw cards from a deck:
- Population is finite (your deck has a specific number of cards)
- Drawing without replacement (once you draw a card, it's not available for the next draw)
- Each draw affects the probability of subsequent draws

This is different from binomial distribution, which assumes replacement or an infinite population.

## The Mathematics

### Formula

```
P(X >= k) = 1 - P(X <= k-1)
```

Where:
- **N** (deck_size): Total cards in the deck
- **K** (matching_cards): Number of cards that match your search criteria
- **n** (draw_count): Number of cards you're drawing
- **k** (min_matches): Minimum number of matches you want

### Probability Mass Function

The probability of getting exactly k matches is:

```
P(X = k) = C(K, k) × C(N-K, n-k) / C(N, n)
```

Where C(n, k) is the binomial coefficient "n choose k".

### Cumulative Distribution Function

The probability of getting k or fewer matches is:

```
P(X <= k) = Σ P(X = i) for i = 0 to k
```

### Calculating "At Least" Probabilities

Since we want "at least k matches", we calculate:

```
P(X >= k) = 1 - P(X <= k-1)
```

## Implementation

### Native Implementation

This application uses a native implementation of the hypergeometric distribution (no external dependencies like scipy).

```python
def hypergeom_pmf(k, M, n, N):
    """
    Calculate probability mass function for hypergeometric distribution.
    P(X = k) = C(n, k) * C(M-n, N-k) / C(M, N)
    """
    numerator = binomial_coefficient(n, k) * binomial_coefficient(M - n, N - k)
    denominator = binomial_coefficient(M, N)
    return numerator / denominator

def hypergeom_cdf(k, M, n, N):
    """
    Calculate cumulative distribution function.
    P(X <= k) = sum of P(X = i) for i = 0 to k
    """
    cumulative = 0.0
    for i in range(int(k) + 1):
        cumulative += hypergeom_pmf(i, M, n, N)
    return cumulative
```

### Optimization for Common Case

For the common case of "at least 1 match", we use a shortcut:

```python
if min_matches == 1:
    # P(X >= 1) = 1 - P(X = 0)
    return 1 - hypergeom_pmf(0, deck_size, matching_cards, draw_count)
```

This is more efficient than calculating the full CDF.

## Examples

### Example 1: Drawing Aces

**Question**: What is the probability of drawing at least 1 Ace in 5 cards from a standard 52-card deck?

**Parameters**:
- N (deck_size) = 52
- K (matching_cards) = 4 (there are 4 Aces)
- n (draw_count) = 5
- k (min_matches) = 1

**Calculation**:
```
P(X >= 1) = 1 - P(X = 0)
P(X = 0) = C(4, 0) × C(48, 5) / C(52, 5)
P(X = 0) = 1 × 1,712,304 / 2,598,960
P(X = 0) = 0.659
P(X >= 1) = 1 - 0.659 = 0.341
```

**Result**: 34.1% probability

### Example 2: Drawing Hearts

**Question**: What is the probability of drawing at least 2 Hearts in 7 cards from a standard deck?

**Parameters**:
- N = 52
- K = 13 (there are 13 Hearts)
- n = 7
- k = 2

**Calculation**:
```
P(X >= 2) = 1 - P(X <= 1)
P(X <= 1) = P(X = 0) + P(X = 1)
```

After calculating both terms and summing:
```
P(X >= 2) = 0.697
```

**Result**: 69.7% probability

### Example 3: Drawing Red Cards

**Question**: What is the probability of drawing at least 3 Red cards in 8 cards?

**Parameters**:
- N = 52
- K = 26 (26 red cards: 13 Hearts + 13 Diamonds)
- n = 8
- k = 3

**Result**: 93.7% probability

## Edge Cases

### Impossible Scenarios

When you request more matches than exist:

```python
# Drawing 5 Aces when only 4 exist
calculate_probability(52, 4, 5, 5)  # Returns 0.0
```

### Guaranteed Scenarios

When there aren't enough non-matching cards to avoid getting matches:

```python
# 50 Aces in 52 cards, draw 5, need 1 Ace
# Only 2 non-Aces exist, can't draw 5 cards without getting an Ace
calculate_probability(52, 50, 5, 1)  # Returns 1.0
```

### Zero Matches

Requesting at least 0 matches is always certain:

```python
calculate_probability(52, 4, 5, 0)  # Returns 1.0
```

## Input Validation

Before calculating, the application validates:

1. **Deck size >= 1**: Must have at least one card
2. **Matching cards <= deck size**: Can't have more matches than total cards
3. **Draw count <= deck size**: Can't draw more than the deck contains
4. **Min matches <= draw count**: Can't require more matches than cards drawn
5. **Min matches >= 1**: Must request at least 1 match

Invalid inputs return clear error messages.

## Performance Characteristics

### Time Complexity

- Binomial coefficient calculation: O(k) where k is the smaller of (n, k) in C(n, k)
- PMF calculation: O(1) for single probability
- CDF calculation: O(k) where k is the upper bound

For typical card game scenarios (n <= 52, k <= 13), calculations are near-instantaneous.

### Numerical Stability

The implementation uses integer arithmetic for binomial coefficients until the final division, minimizing floating-point errors. The iterative multiplication approach avoids factorial overflow for reasonable input sizes.

## Why Not Use Approximations?

For small population sizes (like a 52-card deck), exact calculation is:
- Fast enough (sub-millisecond)
- More accurate than approximations
- Simpler to implement and verify

Normal or binomial approximations would introduce unnecessary error for negligible performance gain.

## References

- [Hypergeometric Distribution](https://en.wikipedia.org/wiki/Hypergeometric_distribution) - Wikipedia
- The calculation follows standard statistical formulas for hypergeometric distribution without replacement

## Summary

This application uses exact hypergeometric distribution calculations to provide accurate probabilities for card draw scenarios. The implementation is optimized for the common "at least 1" case while maintaining accuracy for all valid inputs through native calculation without external dependencies.
