// Poker hand detection for Balatro
// Reference: https://balatrogame.fandom.com/wiki/Poker_Hands

import type { Card, Rank, Suit } from './types';

export type PokerHandType =
  | 'High Card'
  | 'Pair'
  | 'Two Pair'
  | 'Three of a Kind'
  | 'Straight'
  | 'Flush'
  | 'Full House'
  | 'Four of a Kind'
  | 'Straight Flush'
  | 'Royal Flush'
  | 'Five of a Kind'
  | 'Flush Five'
  | 'Flush House';

const RANK_VALUES: Record<Rank, number> = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10,
  '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

interface RankCount {
  rank: Rank;
  count: number;
}

interface SuitCount {
  suit: Suit;
  count: number;
}

function getRankCounts(cards: Card[]): RankCount[] {
  const counts = new Map<Rank, number>();
  cards.forEach(card => {
    counts.set(card.rank, (counts.get(card.rank) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([rank, count]) => ({ rank, count }))
    .sort((a, b) => b.count - a.count || RANK_VALUES[b.rank] - RANK_VALUES[a.rank]);
}

function getSuitCounts(cards: Card[]): SuitCount[] {
  const counts = new Map<Suit, number>();
  cards.forEach(card => {
    counts.set(card.suit, (counts.get(card.suit) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([suit, count]) => ({ suit, count }))
    .sort((a, b) => b.count - a.count);
}

function isStraight(cards: Card[]): boolean {
  if (cards.length < 5) return false;

  const uniqueRanks = [...new Set(cards.map(c => c.rank))];
  if (uniqueRanks.length < 5) return false;

  const values = uniqueRanks.map(r => RANK_VALUES[r]).sort((a, b) => b - a);

  // Check for regular straight (5 consecutive cards)
  for (let i = 0; i <= values.length - 5; i++) {
    let isConsecutive = true;
    for (let j = 0; j < 4; j++) {
      if (values[i + j] - values[i + j + 1] !== 1) {
        isConsecutive = false;
        break;
      }
    }
    if (isConsecutive) return true;
  }

  // Check for A-2-3-4-5 straight (wheel)
  if (values.includes(14) && values.includes(5) && values.includes(4) &&
      values.includes(3) && values.includes(2)) {
    return true;
  }

  return false;
}

function isFlush(cards: Card[]): boolean {
  if (cards.length < 5) return false;
  const suitCounts = getSuitCounts(cards);
  return suitCounts[0].count >= 5;
}

function isRoyalFlush(cards: Card[]): boolean {
  if (!isStraight(cards) || !isFlush(cards)) return false;

  // Check if we have 10, J, Q, K, A of same suit
  const royalRanks = new Set<Rank>(['10', 'J', 'Q', 'K', 'A']);
  const suitCounts = getSuitCounts(cards);
  const flushSuit = suitCounts[0].suit;

  const royalCards = cards.filter(c => c.suit === flushSuit && royalRanks.has(c.rank));
  return royalCards.length === 5;
}

export function detectPokerHands(cards: Card[]): Set<PokerHandType> {
  const hands = new Set<PokerHandType>();

  if (cards.length === 0) return hands;

  const rankCounts = getRankCounts(cards);
  const hasStraight = isStraight(cards);
  const hasFlush = isFlush(cards);

  // Five of a Kind (secret hand)
  if (rankCounts[0].count >= 5) {
    hands.add('Five of a Kind');
  }

  // Four of a Kind
  if (rankCounts[0].count >= 4) {
    hands.add('Four of a Kind');
  }

  // Full House: Three of a kind + pair
  if (rankCounts[0].count >= 3 && rankCounts.length >= 2 && rankCounts[1].count >= 2) {
    hands.add('Full House');
  }

  // Three of a Kind
  if (rankCounts[0].count >= 3) {
    hands.add('Three of a Kind');
  }

  // Two Pair
  if (rankCounts.length >= 2 && rankCounts[0].count >= 2 && rankCounts[1].count >= 2) {
    hands.add('Two Pair');
  }

  // Pair
  if (rankCounts[0].count >= 2) {
    hands.add('Pair');
  }

  // Royal Flush
  if (isRoyalFlush(cards)) {
    hands.add('Royal Flush');
  }

  // Straight Flush
  if (hasStraight && hasFlush) {
    hands.add('Straight Flush');
  }

  // Flush
  if (hasFlush) {
    hands.add('Flush');
  }

  // Straight
  if (hasStraight) {
    hands.add('Straight');
  }

  // Flush Five (secret): Five of a kind + Flush
  if (rankCounts[0].count >= 5 && hasFlush) {
    const fiveOfAKindRank = rankCounts[0].rank;
    const cardsOfRank = cards.filter(c => c.rank === fiveOfAKindRank);
    const suitCounts = getSuitCounts(cardsOfRank);
    if (suitCounts[0].count >= 5) {
      hands.add('Flush Five');
    }
  }

  // Flush House (secret): Full House + Flush
  if (hands.has('Full House') && hasFlush) {
    const fullHouseCards = cards.filter(c =>
      c.rank === rankCounts[0].rank || c.rank === rankCounts[1].rank
    );
    if (isFlush(fullHouseCards)) {
      hands.add('Flush House');
    }
  }

  // High Card (always present if we have any cards)
  hands.add('High Card');

  return hands;
}

export const ALL_POKER_HANDS: PokerHandType[] = [
  'Royal Flush',
  'Straight Flush',
  'Five of a Kind',
  'Flush Five',
  'Four of a Kind',
  'Flush House',
  'Full House',
  'Flush',
  'Straight',
  'Three of a Kind',
  'Two Pair',
  'Pair',
  'High Card'
];
