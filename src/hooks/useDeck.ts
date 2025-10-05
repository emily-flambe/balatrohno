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

  const duplicateCards = (ids: string[]) => {
    setDeck(prevDeck => {
      const cardsToDuplicate = prevDeck.filter(card => ids.includes(card.id));
      const duplicates = cardsToDuplicate.map(card => ({
        ...card,
        id: crypto.randomUUID()
      }));
      return [...prevDeck, ...duplicates];
    });
  };

  return { deck, addCard, removeCard, duplicateCards };
}
