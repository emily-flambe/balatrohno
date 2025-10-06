# Calculation Engine Specification

## Purpose

Calculate the probability of drawing at least N matching cards when drawing X cards from a deck.

## The Math

### Hypergeometric Distribution

```
P(X ≥ k) = probability of drawing at least k successes in n draws
```

Where:
- **Population size (N)**: Total cards in deck
- **Success states (K)**: Cards matching search criteria
- **Sample size (n)**: Number of cards being drawn
- **Observed successes (k)**: Minimum matches needed

### Formula

```python
from scipy.stats import hypergeom

# For "at least k matches":
# P(X >= k) = 1 - P(X < k) = 1 - P(X <= k-1)

probability = 1 - hypergeom.cdf(k-1, N, K, n)
```

**That's it. Use scipy. Don't implement it yourself.**

## Python Implementation

### calculate_probability.py

```python
from scipy.stats import hypergeom

def calculate_probability(deck_size, matching_cards, draw_count, min_matches):
    """
    Calculate probability using hypergeometric distribution.

    Args:
        deck_size: Total cards in deck (N)
        matching_cards: Cards matching criteria (K)
        draw_count: Cards being drawn (n)
        min_matches: Minimum matches needed (k)

    Returns:
        float: Probability between 0.0 and 1.0
    """
    if min_matches == 1:
        # P(X >= 1) = 1 - P(X = 0)
        # Slightly more efficient than using cdf
        return 1.0 - hypergeom.pmf(0, deck_size, matching_cards, draw_count)

    # P(X >= k) = 1 - P(X <= k-1)
    return 1.0 - hypergeom.cdf(min_matches - 1, deck_size, matching_cards, draw_count)
```

**~20 lines. Don't overcomplicate it.**

## Edge Cases

### Impossible Scenarios

```python
# Drawing 5 Aces when only 4 exist
calculate_probability(52, 4, 5, 5)  # Returns 0.0

# Drawing more cards than deck has
# Should be caught by validation, but scipy handles it gracefully anyway
```

### Certain Scenarios

```python
# Drawing at least 0 matching cards (always true)
calculate_probability(52, 4, 5, 0)  # Returns 1.0

# All cards match and drawing all of them
calculate_probability(10, 10, 10, 10)  # Returns 1.0
```

### Normal Scenarios

```python
# Drawing at least 1 Ace in 5 cards from standard deck
calculate_probability(52, 4, 5, 1)  # Returns ~0.341 (34.1%)

# Drawing at least 2 Hearts in 7 cards
calculate_probability(52, 13, 7, 2)  # Returns ~0.697 (69.7%)

# Drawing at least 3 Red cards in 8 cards
calculate_probability(52, 26, 8, 3)  # Returns ~0.937 (93.7%)
```

## Validation

### Input Validation

```python
def validate_inputs(deck_size, matching_cards, draw_count, min_matches):
    """
    Validate calculation inputs. Returns error message or None.
    """
    if deck_size < 1:
        return "Deck must contain at least 1 card"

    if matching_cards < 0:
        return "Matching cards cannot be negative"

    if matching_cards > deck_size:
        return "Matching cards cannot exceed deck size"

    if draw_count < 1:
        return "Must draw at least 1 card"

    if draw_count > deck_size:
        return f"Cannot draw {draw_count} cards from deck of {deck_size}"

    if min_matches < 0:
        return "Minimum matches cannot be negative"

    if min_matches > draw_count:
        return f"Minimum matches ({min_matches}) cannot exceed draw count ({draw_count})"

    if min_matches > matching_cards:
        return f"Minimum matches ({min_matches}) cannot exceed matching cards ({matching_cards})"

    return None  # Valid
```

**Validate everything. Return clear error messages.**

## Testing

### Test Cases

```python
def test_impossible_scenario():
    # Drawing 5 Aces when only 4 exist
    prob = calculate_probability(52, 4, 5, 5)
    assert prob == 0.0

def test_certain_scenario():
    # Drawing at least 0 matches always succeeds
    prob = calculate_probability(52, 4, 5, 0)
    assert prob == 1.0

def test_known_probability():
    # Drawing at least 1 Ace in 5 cards
    # Known result: ~0.341
    prob = calculate_probability(52, 4, 5, 1)
    assert 0.34 < prob < 0.35

def test_all_match():
    # All 10 cards are matching, draw all 10
    prob = calculate_probability(10, 10, 10, 5)
    assert prob == 1.0

def test_validation():
    error = validate_inputs(52, 4, 53, 1)
    assert error == "Cannot draw 53 cards from deck of 52"

    error = validate_inputs(52, 4, 5, 6)
    assert error == "Minimum matches (6) cannot exceed draw count (5)"

    error = validate_inputs(52, 4, 5, 1)
    assert error is None  # Valid
```

**Write these tests. Run them. Make sure they pass.**

## Performance

### Current Approach

scipy.stats.hypergeom is:
- Fast (C implementation)
- Accurate (numerical precision)
- Well-tested (battle-tested library)

**Don't optimize unless you measure a problem.**

### If Performance Becomes an Issue

1. **Profile first**: Measure where time is spent
2. **Check scipy version**: Ensure using latest version
3. **Consider caching**: Only if same calculations requested repeatedly

**Don't implement your own hypergeometric calculation. scipy is faster and more accurate.**

## Alternative Formulas (Don't Use These)

### Manual Calculation

```python
# ❌ Don't do this
from math import comb

def manual_hypergeometric(N, K, n, k):
    """Don't implement this. Use scipy instead."""
    # P(X = k) = C(K, k) * C(N-K, n-k) / C(N, n)
    numerator = comb(K, k) * comb(N - K, n - k)
    denominator = comb(N, n)
    return numerator / denominator
```

**Problems:**
- Integer overflow for large numbers
- Numerical precision issues
- Slower than scipy
- You'll get the edge cases wrong

### Complementary Probability

```python
# ❌ More complex than needed
def at_least_k_manual(N, K, n, k):
    """Don't implement this. Use scipy.cdf instead."""
    total = 0.0
    for i in range(k, min(n, K) + 1):
        total += manual_hypergeometric(N, K, n, i)
    return total
```

**Problems:**
- Accumulation of floating point errors
- Slower than cdf
- More code to maintain

**Just use scipy. It's designed for this.**

## Dependencies

```
# requirements.txt
scipy>=1.11.0
```

**One dependency. That's all you need.**

## Summary

**Calculation principle: Use the right tool.**

- scipy.stats.hypergeom for calculations
- Simple validation function
- Clear error messages
- Test the edge cases
- Don't reimplement hypergeometric distribution yourself

The math is solved. Just use scipy correctly.
