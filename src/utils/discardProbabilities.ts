import type { Rank, Suit } from '../lib/types'

export interface TableRow {
  cardType: string
  category: 'suit' | 'rank' | 'specific'
  probabilities: number[]
}

/**
 * Calculate binomial coefficient C(n, k) = n! / (k! * (n-k)!)
 */
function binomialCoefficient(n: number, k: number): number {
  if (k < 0 || k > n) {
    return 0
  }
  if (k === 0 || k === n) {
    return 1
  }
  k = Math.min(k, n - k)
  let result = 1
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1)
  }
  return result
}

/**
 * Calculate probability mass function for hypergeometric distribution.
 * P(X = k) = C(n, k) * C(M-n, N-k) / C(M, N)
 *
 * @param k - number of observed successes
 * @param M - population size (deck_size)
 * @param n - number of success states in population (matching_cards)
 * @param N - number of draws (draw_count)
 */
function hypergeomPmf(k: number, M: number, n: number, N: number): number {
  const numerator = binomialCoefficient(n, k) * binomialCoefficient(M - n, N - k)
  const denominator = binomialCoefficient(M, N)
  if (denominator === 0) {
    return 0.0
  }
  return numerator / denominator
}

/**
 * Calculate cumulative distribution function for hypergeometric distribution.
 * P(X <= k) = sum of P(X = i) for i = 0 to k
 *
 * @param k - upper bound for cumulative probability
 * @param M - population size (deck_size)
 * @param n - number of success states in population (matching_cards)
 * @param N - number of draws (draw_count)
 */
function hypergeomCdf(k: number, M: number, n: number, N: number): number {
  let cumulative = 0.0
  for (let i = 0; i <= Math.floor(k); i++) {
    cumulative += hypergeomPmf(i, M, n, N)
  }
  return cumulative
}

/**
 * Calculate probability of drawing at least min_matches cards
 * using hypergeometric distribution.
 *
 * @param deckSize - total cards in deck
 * @param matchingCards - number of cards that match criteria
 * @param drawCount - number of cards to draw
 * @param minMatches - minimum number of matches needed
 */
function calculateProbability(
  deckSize: number,
  matchingCards: number,
  drawCount: number,
  minMatches: number
): number {
  // Probability is 0% if not enough matching cards exist
  if (matchingCards < minMatches) {
    return 0.0
  }

  // Probability is 100% if impossible to avoid getting min_matches
  const nonMatchingCards = deckSize - matchingCards
  if (nonMatchingCards < drawCount - minMatches + 1) {
    return 1.0
  }

  // Calculate P(X >= min_matches) = 1 - P(X <= min_matches - 1)
  if (minMatches === 1) {
    // P(X >= 1) = 1 - P(X = 0)
    return 1 - hypergeomPmf(0, deckSize, matchingCards, drawCount)
  } else {
    // P(X >= min_matches) = 1 - P(X <= min_matches - 1)
    return 1 - hypergeomCdf(minMatches - 1, deckSize, matchingCards, drawCount)
  }
}

/**
 * Count cards matching search criteria.
 *
 * @param deck - Array of card IDs (e.g., "AH", "2D", "KS")
 * @param rank - Specific rank to match, or 'any' to match all ranks
 * @param suit - Specific suit to match, or 'any' to match all suits
 */
function countMatchingCards(deck: string[], rank: Rank | 'any', suit: Suit | 'any'): number {
  let count = 0
  for (const cardId of deck) {
    const cardRank = parseRank(cardId)
    const cardSuit = parseSuit(cardId)

    const rankMatch = rank === 'any' || cardRank === rank
    const suitMatch = suit === 'any' || cardSuit === suit

    if (rankMatch && suitMatch) {
      count++
    }
  }
  return count
}

/**
 * Parse rank from card ID (e.g., "AH" -> "A", "10D" -> "10")
 */
function parseRank(cardId: string): Rank {
  if (cardId.startsWith('10')) {
    return '10'
  }
  return cardId[0] as Rank
}

/**
 * Parse suit from card ID (e.g., "AH" -> "hearts", "10D" -> "diamonds")
 */
function parseSuit(cardId: string): Suit {
  const suitChar = cardId.slice(-1)
  const suitMap: Record<string, Suit> = {
    H: 'hearts',
    D: 'diamonds',
    C: 'clubs',
    S: 'spades',
  }
  return suitMap[suitChar] as Suit
}

/**
 * Generate card type label based on rank and suit
 */
function getCardTypeLabel(rank: Rank | 'any', suit: Suit | 'any'): string {
  if (rank !== 'any' && suit !== 'any') {
    // Specific card: "AH", "10D", etc.
    return `${rank}${suit[0].toUpperCase()}`
  } else if (rank !== 'any') {
    // Rank group: "Any Ace", "Any 2", etc.
    const rankName = rank === 'A' ? 'Ace' : rank === 'K' ? 'King' : rank === 'Q' ? 'Queen' : rank === 'J' ? 'Jack' : rank
    return `Any ${rankName}`
  } else if (suit !== 'any') {
    // Suit group: "Any Hearts", "Any Diamonds", etc.
    return `Any ${suit.charAt(0).toUpperCase() + suit.slice(1)}`
  }
  return 'Unknown'
}

/**
 * Calculate discard probabilities for all card types.
 *
 * @param remainingDeck - Array of card IDs in the remaining deck
 * @param drawCounts - Array of N values (e.g., [1, 2, 3] for 3 discards)
 * @returns Array of table rows with probabilities for each N value
 */
export function calculateDiscardProbabilities(
  remainingDeck: string[],
  drawCounts: number[]
): TableRow[] {
  const rows: TableRow[] = []
  const deckSize = remainingDeck.length

  // If deck is empty, return empty array
  if (deckSize === 0) {
    return rows
  }

  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

  // 1. Suit Groups (4 rows)
  for (const suit of suits) {
    const matchingCards = countMatchingCards(remainingDeck, 'any', suit)
    const probabilities = drawCounts.map((drawCount) =>
      calculateProbability(deckSize, matchingCards, drawCount, 1)
    )
    rows.push({
      cardType: getCardTypeLabel('any', suit),
      category: 'suit',
      probabilities,
    })
  }

  // 2. Rank Groups (13 rows)
  for (const rank of ranks) {
    const matchingCards = countMatchingCards(remainingDeck, rank, 'any')
    const probabilities = drawCounts.map((drawCount) =>
      calculateProbability(deckSize, matchingCards, drawCount, 1)
    )
    rows.push({
      cardType: getCardTypeLabel(rank, 'any'),
      category: 'rank',
      probabilities,
    })
  }

  // 3. Specific Cards (52 rows, organized by suit then rank)
  for (const suit of suits) {
    for (const rank of ranks) {
      const matchingCards = countMatchingCards(remainingDeck, rank, suit)
      const probabilities = drawCounts.map((drawCount) =>
        calculateProbability(deckSize, matchingCards, drawCount, 1)
      )
      rows.push({
        cardType: getCardTypeLabel(rank, suit),
        category: 'specific',
        probabilities,
      })
    }
  }

  return rows
}
