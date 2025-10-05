import { useState, useCallback } from 'react';
import type { Card } from '../lib/types';
import { createStandardDeck } from '../lib/deck';

export function useDeck() {
  const [deck, setDeck] = useState<Card[]>(createStandardDeck());
  const [history, setHistory] = useState<Card[][]>([createStandardDeck()]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = useCallback((newDeck: Card[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newDeck);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const addCard = (card: Card) => {
    setDeck(prevDeck => {
      const newDeck = [...prevDeck, card];
      saveToHistory(newDeck);
      return newDeck;
    });
  };

  const removeCard = (id: string) => {
    setDeck(prevDeck => {
      const newDeck = prevDeck.filter(card => card.id !== id);
      saveToHistory(newDeck);
      return newDeck;
    });
  };

  const duplicateCards = (ids: string[]) => {
    setDeck(prevDeck => {
      const cardsToDuplicate = prevDeck.filter(card => ids.includes(card.id));
      const duplicates = cardsToDuplicate.map(card => ({
        ...card,
        id: crypto.randomUUID()
      }));
      const newDeck = [...prevDeck, ...duplicates];
      saveToHistory(newDeck);
      return newDeck;
    });
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setDeck(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setDeck(history[newIndex]);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return { deck, addCard, removeCard, duplicateCards, undo, redo, canUndo, canRedo };
}
