import { useState } from 'react';
import type { Card } from '../lib/types';
import { createStandardDeck } from '../lib/deck';

export function useDeck() {
  const [deck, setDeck] = useState<Card[]>(createStandardDeck());

  const addCard = (card: Card) => {
    setDeck(prevDeck => [...prevDeck, card]);
  };

  const removeCard = (id: string) => {
    setDeck(prevDeck => prevDeck.filter(card => card.id !== id));
  };

  return { deck, addCard, removeCard };
}
