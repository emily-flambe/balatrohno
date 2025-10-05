import { describe, it, expect } from 'vitest';
import { detectPokerHands } from './pokerHands';
import type { Card, Rank, Suit } from './types';

function createCard(rank: Rank, suit: Suit, id: string): Card {
  return { rank, suit, id };
}

describe('detectPokerHands', () => {
  describe('High Card', () => {
    it('detects high card with any cards', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('2', 'hearts', '2'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('High Card')).toBe(true);
    });
  });

  describe('Pair', () => {
    it('detects pair with two cards of same rank', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('A', 'hearts', '2'),
        createCard('K', 'diamonds', '3'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Pair')).toBe(true);
    });

    it('does not detect pair with all different ranks', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('K', 'hearts', '2'),
        createCard('Q', 'diamonds', '3'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Pair')).toBe(false);
    });
  });

  describe('Two Pair', () => {
    it('detects two pair with two different pairs', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('A', 'hearts', '2'),
        createCard('K', 'diamonds', '3'),
        createCard('K', 'clubs', '4'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Two Pair')).toBe(true);
    });

    it('does not detect two pair with only one pair', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('A', 'hearts', '2'),
        createCard('K', 'diamonds', '3'),
        createCard('Q', 'clubs', '4'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Two Pair')).toBe(false);
    });
  });

  describe('Three of a Kind', () => {
    it('detects three of a kind', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('A', 'hearts', '2'),
        createCard('A', 'diamonds', '3'),
        createCard('K', 'clubs', '4'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Three of a Kind')).toBe(true);
    });
  });

  describe('Straight', () => {
    it('detects straight with 5 consecutive cards', () => {
      const hand = [
        createCard('5', 'spades', '1'),
        createCard('6', 'hearts', '2'),
        createCard('7', 'diamonds', '3'),
        createCard('8', 'clubs', '4'),
        createCard('9', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Straight')).toBe(true);
    });

    it('detects A-2-3-4-5 wheel straight', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('2', 'hearts', '2'),
        createCard('3', 'diamonds', '3'),
        createCard('4', 'clubs', '4'),
        createCard('5', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Straight')).toBe(true);
    });

    it('does not detect straight with gap', () => {
      const hand = [
        createCard('5', 'spades', '1'),
        createCard('6', 'hearts', '2'),
        createCard('7', 'diamonds', '3'),
        createCard('9', 'clubs', '4'),
        createCard('10', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Straight')).toBe(false);
    });

    it('does not detect straight with less than 5 cards', () => {
      const hand = [
        createCard('5', 'spades', '1'),
        createCard('6', 'hearts', '2'),
        createCard('7', 'diamonds', '3'),
        createCard('8', 'clubs', '4'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Straight')).toBe(false);
    });
  });

  describe('Flush', () => {
    it('detects flush with 5+ cards of same suit', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('3', 'spades', '2'),
        createCard('5', 'spades', '3'),
        createCard('7', 'spades', '4'),
        createCard('9', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Flush')).toBe(true);
    });

    it('does not detect flush with less than 5 cards of same suit', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('3', 'spades', '2'),
        createCard('5', 'spades', '3'),
        createCard('7', 'spades', '4'),
        createCard('9', 'hearts', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Flush')).toBe(false);
    });
  });

  describe('Full House', () => {
    it('detects full house with three of a kind and pair', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('A', 'hearts', '2'),
        createCard('A', 'diamonds', '3'),
        createCard('K', 'clubs', '4'),
        createCard('K', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Full House')).toBe(true);
    });
  });

  describe('Four of a Kind', () => {
    it('detects four of a kind', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('A', 'hearts', '2'),
        createCard('A', 'diamonds', '3'),
        createCard('A', 'clubs', '4'),
        createCard('K', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Four of a Kind')).toBe(true);
    });
  });

  describe('Straight Flush', () => {
    it('detects straight flush', () => {
      const hand = [
        createCard('5', 'spades', '1'),
        createCard('6', 'spades', '2'),
        createCard('7', 'spades', '3'),
        createCard('8', 'spades', '4'),
        createCard('9', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Straight Flush')).toBe(true);
      expect(hands.has('Straight')).toBe(true);
      expect(hands.has('Flush')).toBe(true);
    });
  });

  describe('Royal Flush', () => {
    it('detects royal flush with 10-J-Q-K-A of same suit', () => {
      const hand = [
        createCard('10', 'spades', '1'),
        createCard('J', 'spades', '2'),
        createCard('Q', 'spades', '3'),
        createCard('K', 'spades', '4'),
        createCard('A', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Royal Flush')).toBe(true);
      expect(hands.has('Straight Flush')).toBe(true);
    });

    it('does not detect royal flush with different suits', () => {
      const hand = [
        createCard('10', 'spades', '1'),
        createCard('J', 'hearts', '2'),
        createCard('Q', 'spades', '3'),
        createCard('K', 'spades', '4'),
        createCard('A', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Royal Flush')).toBe(false);
    });
  });

  describe('Five of a Kind (secret)', () => {
    it('detects five of a kind', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('A', 'hearts', '2'),
        createCard('A', 'diamonds', '3'),
        createCard('A', 'clubs', '4'),
        createCard('A', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Five of a Kind')).toBe(true);
    });
  });

  describe('Flush Five (secret)', () => {
    it('detects flush five with 5 cards of same rank and suit', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('A', 'spades', '2'),
        createCard('A', 'spades', '3'),
        createCard('A', 'spades', '4'),
        createCard('A', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Flush Five')).toBe(true);
      expect(hands.has('Five of a Kind')).toBe(true);
      expect(hands.has('Flush')).toBe(true);
    });

    it('does not detect flush five with 5 of a kind but different suits', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('A', 'hearts', '2'),
        createCard('A', 'diamonds', '3'),
        createCard('A', 'clubs', '4'),
        createCard('A', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Flush Five')).toBe(false);
    });
  });

  describe('Flush House (secret)', () => {
    it('detects flush house with full house all same suit', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('A', 'spades', '2'),
        createCard('A', 'spades', '3'),
        createCard('K', 'spades', '4'),
        createCard('K', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Flush House')).toBe(true);
      expect(hands.has('Full House')).toBe(true);
      expect(hands.has('Flush')).toBe(true);
    });

    it('does not detect flush house with full house of mixed suits', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('A', 'hearts', '2'),
        createCard('A', 'diamonds', '3'),
        createCard('K', 'clubs', '4'),
        createCard('K', 'spades', '5'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Flush House')).toBe(false);
      expect(hands.has('Full House')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('returns empty set for empty hand', () => {
      const hands = detectPokerHands([]);
      expect(hands.size).toBe(0);
    });

    it('detects multiple hand types correctly', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('A', 'hearts', '2'),
        createCard('A', 'diamonds', '3'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Three of a Kind')).toBe(true);
      expect(hands.has('Pair')).toBe(true);
      expect(hands.has('High Card')).toBe(true);
    });

    it('works with 8-card hand (Balatro size)', () => {
      const hand = [
        createCard('A', 'spades', '1'),
        createCard('A', 'hearts', '2'),
        createCard('K', 'diamonds', '3'),
        createCard('Q', 'clubs', '4'),
        createCard('J', 'spades', '5'),
        createCard('10', 'hearts', '6'),
        createCard('9', 'diamonds', '7'),
        createCard('8', 'clubs', '8'),
      ];
      const hands = detectPokerHands(hand);
      expect(hands.has('Pair')).toBe(true);
      expect(hands.has('Straight')).toBe(true);
    });
  });
});
