import type { Card, Rank, Suit } from './types';

export function createStandardDeck(): Card[] {
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        id: `${rank}-${suit}`,
        rank,
        suit
      });
    }
  }

  return deck;
}
