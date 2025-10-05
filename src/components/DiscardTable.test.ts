import { describe, it, expect } from 'vitest';
import type { Card, Rank, Suit } from '../lib/types';

// Extract the math functions to test them in isolation
function combination(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  if (r === 0 || r === n) return 1;

  let result = 1;
  for (let i = 1; i <= r; i++) {
    result = result * (n - i + 1) / i;
  }
  return result;
}

function calculateProbability(
  targetCards: Card[],
  minMatches: number,
  numDiscards: number,
  deckSize: number
): number {
  if (targetCards.length === 0 || deckSize === 0 || numDiscards > deckSize) {
    return 0;
  }

  const k = targetCards.length;
  const nonTargetCards = deckSize - k;

  let probability = 0;
  for (let i = minMatches; i <= Math.min(numDiscards, k); i++) {
    const ways = combination(k, i) * combination(nonTargetCards, numDiscards - i);
    const total = combination(deckSize, numDiscards);
    probability += ways / total;
  }

  return probability;
}

function calculateNOfAKindProbability(
  remainingDeck: Card[],
  minMatches: number,
  numDiscards: number
): number {
  const deckSize = remainingDeck.length;

  if (deckSize === 0 || numDiscards > deckSize || minMatches > numDiscards) {
    return 0;
  }

  if (minMatches === 1) {
    return 1.0;
  }

  const rankCounts = new Map<Rank, number>();
  for (const card of remainingDeck) {
    rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
  }

  if (minMatches === 2) {
    const numRanks = rankCounts.size;

    if (numDiscards > numRanks) {
      return 1.0;
    }

    const ranksArray = Array.from(rankCounts.entries());

    const countWaysAllDifferent = (rankIndex: number, cardsLeft: number, product: number): number => {
      if (cardsLeft === 0) {
        return product;
      }
      if (rankIndex >= ranksArray.length) {
        return 0;
      }
      if (ranksArray.length - rankIndex < cardsLeft) {
        return 0;
      }

      const withThis = countWaysAllDifferent(rankIndex + 1, cardsLeft - 1, product * ranksArray[rankIndex][1]);
      const withoutThis = countWaysAllDifferent(rankIndex + 1, cardsLeft, product);

      return withThis + withoutThis;
    };

    const waysAllDifferent = countWaysAllDifferent(0, numDiscards, 1);
    const totalWays = combination(deckSize, numDiscards);
    const probAllDifferent = waysAllDifferent / totalWays;
    const probPair = 1 - probAllDifferent;

    return probPair;
  }

  const ranksWithEnough = Array.from(rankCounts.entries()).filter(([_, count]) => count >= minMatches);

  if (ranksWithEnough.length === 0) {
    return 0;
  }

  let totalProb = 0;

  for (const [rank, k] of ranksWithEnough) {
    for (let i = minMatches; i <= Math.min(numDiscards, k); i++) {
      const ways = combination(k, i) * combination(deckSize - k, numDiscards - i);
      const total = combination(deckSize, numDiscards);
      totalProb += ways / total;
    }
  }

  return Math.min(totalProb, 1.0);
}

// Helper to create test cards
function createCard(rank: Rank, suit: Suit, id: string): Card {
  return { rank, suit, id };
}

describe('Probability Calculation Functions', () => {
  describe('combination', () => {
    it('calculates C(4,2) = 6', () => {
      expect(combination(4, 2)).toBe(6);
    });

    it('calculates C(52,5) correctly', () => {
      expect(combination(52, 5)).toBe(2598960);
    });

    it('returns 1 for C(n,0) and C(n,n)', () => {
      expect(combination(10, 0)).toBe(1);
      expect(combination(10, 10)).toBe(1);
    });

    it('returns 0 for invalid inputs', () => {
      expect(combination(5, 10)).toBe(0);
      expect(combination(5, -1)).toBe(0);
    });
  });

  describe('calculateProbability - Hypergeometric Distribution', () => {
    it('drawing 1 card from 1 target card in 2-card deck: 50%', () => {
      const deck: Card[] = [
        createCard('A', 'hearts', '1'),
        createCard('K', 'spades', '2'),
      ];
      const targetCards = [deck[0]];
      const prob = calculateProbability(targetCards, 1, 1, 2);
      expect(prob).toBeCloseTo(0.5, 5);
    });

    it('drawing 2 cards from 4 hearts in 13-card deck (≥1 heart)', () => {
      // 4 hearts, 9 non-hearts, draw 2
      // P(at least 1 heart) = 1 - P(0 hearts)
      // P(0 hearts) = C(9,2)/C(13,2) = 36/78
      // P(≥1 heart) = 42/78 = 0.538...
      const deck: Card[] = [
        createCard('A', 'hearts', '1'),
        createCard('K', 'hearts', '2'),
        createCard('Q', 'hearts', '3'),
        createCard('J', 'hearts', '4'),
        createCard('2', 'spades', '5'),
        createCard('3', 'spades', '6'),
        createCard('4', 'spades', '7'),
        createCard('5', 'spades', '8'),
        createCard('6', 'spades', '9'),
        createCard('7', 'spades', '10'),
        createCard('8', 'spades', '11'),
        createCard('9', 'spades', '12'),
        createCard('10', 'spades', '13'),
      ];
      const hearts = deck.slice(0, 4);
      const prob = calculateProbability(hearts, 1, 2, 13);
      expect(prob).toBeCloseTo(42 / 78, 5);
    });

    it('drawing 3 cards from 4 eights in 4-card deck (≥3 eights): 100%', () => {
      const deck: Card[] = [
        createCard('8', 'hearts', '1'),
        createCard('8', 'diamonds', '2'),
        createCard('8', 'clubs', '3'),
        createCard('8', 'spades', '4'),
      ];
      const prob = calculateProbability(deck, 3, 3, 4);
      expect(prob).toBe(1.0);
    });

    it('drawing 5 cards from 13 spades in 52-card deck (≥2 spades)', () => {
      // Create minimal test deck for calculation
      // P(≥2 spades) = sum of P(exactly 2), P(exactly 3), P(exactly 4), P(exactly 5)
      const deck: Card[] = [];
      const spades: Card[] = [];

      // Create 13 spades
      const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      for (let i = 0; i < 13; i++) {
        const card = createCard(ranks[i], 'spades', `spade${i}`);
        spades.push(card);
        deck.push(card);
      }

      // Create 39 non-spades
      const otherSuits: Suit[] = ['hearts', 'diamonds', 'clubs'];
      for (let i = 0; i < 39; i++) {
        const suitIndex = Math.floor(i / 13);
        const rankIndex = i % 13;
        deck.push(createCard(ranks[rankIndex], otherSuits[suitIndex], `other${i}`));
      }

      const prob = calculateProbability(spades, 2, 5, 52);
      // Known value: approximately 0.367
      expect(prob).toBeCloseTo(0.367, 2);
    });
  });

  describe('calculateNOfAKindProbability', () => {
    it('minMatches=1 always returns 100%', () => {
      const deck: Card[] = [
        createCard('A', 'hearts', '1'),
        createCard('K', 'spades', '2'),
      ];
      const prob = calculateNOfAKindProbability(deck, 1, 2);
      expect(prob).toBe(1.0);
    });

    it('drawing 2 from deck with all different ranks: 0% pair probability', () => {
      const deck: Card[] = [
        createCard('A', 'hearts', '1'),
        createCard('K', 'spades', '2'),
        createCard('Q', 'diamonds', '3'),
        createCard('J', 'clubs', '4'),
      ];
      const prob = calculateNOfAKindProbability(deck, 2, 2);
      expect(prob).toBe(0);
    });

    it('drawing 3 from 4 eights: 100% for trips', () => {
      const deck: Card[] = [
        createCard('8', 'hearts', '1'),
        createCard('8', 'diamonds', '2'),
        createCard('8', 'clubs', '3'),
        createCard('8', 'spades', '4'),
      ];
      const prob = calculateNOfAKindProbability(deck, 3, 3);
      expect(prob).toBe(1.0);
    });

    it('drawing 3 from 3 ranks (3 cards each): 100% pair by pigeonhole', () => {
      const deck: Card[] = [
        createCard('A', 'hearts', '1'),
        createCard('A', 'spades', '2'),
        createCard('A', 'diamonds', '3'),
        createCard('K', 'hearts', '4'),
        createCard('K', 'spades', '5'),
        createCard('K', 'diamonds', '6'),
        createCard('Q', 'hearts', '7'),
        createCard('Q', 'spades', '8'),
        createCard('Q', 'diamonds', '9'),
      ];
      const prob = calculateNOfAKindProbability(deck, 2, 4);
      // Drawing 4 cards from 3 ranks: must have at least one pair by pigeonhole
      expect(prob).toBe(1.0);
    });

    it('drawing 2 from 43-card deck with various ranks: reasonable pair probability', () => {
      // Simplified 43-card deck
      const deck: Card[] = [];
      const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

      let id = 0;
      // Create standard deck minus some cards to get to 43
      for (const rank of ranks) {
        for (const suit of suits) {
          if (id < 43) {
            deck.push(createCard(rank, suit, `card${id++}`));
          }
        }
      }

      const prob = calculateNOfAKindProbability(deck, 2, 2);
      // Probability should be small but non-zero
      // With ~13 ranks and ~3-4 of each, P(pair) ≈ 5-15%
      expect(prob).toBeGreaterThan(0);
      expect(prob).toBeLessThan(0.2);
    });

    it('drawing 3 from deck with one quad and rest singletons: high trips probability', () => {
      const deck: Card[] = [
        createCard('8', 'hearts', '1'),
        createCard('8', 'diamonds', '2'),
        createCard('8', 'clubs', '3'),
        createCard('8', 'spades', '4'),
        createCard('A', 'hearts', '5'),
        createCard('K', 'hearts', '6'),
        createCard('Q', 'hearts', '7'),
      ];
      const prob = calculateNOfAKindProbability(deck, 3, 3);
      // P(≥3 eights) = C(4,3)*C(3,0)/C(7,3) = 4*1/35 = 0.114...
      expect(prob).toBeCloseTo(4 / 35, 5);
    });
  });
});
