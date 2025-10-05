import { useState, useMemo } from 'react';
import type { Card as CardType, Rank, Suit } from '../lib/types';
import { HandCard } from './HandCard';

interface HandDisplayProps {
  cards: CardType[];
  onCardClick: (id: string) => void;
  selectedForDiscard?: Set<string>;
  onToggleDiscard?: (id: string) => void;
}

const rankOrder: Record<Rank, number> = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10,
  '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

const suitOrder: Record<Suit, number> = {
  'spades': 4, 'hearts': 3, 'clubs': 2, 'diamonds': 1
};

export function HandDisplay({ cards, onCardClick, selectedForDiscard, onToggleDiscard }: HandDisplayProps) {
  const [sortBy, setSortBy] = useState<'rank' | 'suit'>('rank');

  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => {
      if (sortBy === 'rank') {
        const rankDiff = rankOrder[b.rank] - rankOrder[a.rank];
        if (rankDiff !== 0) return rankDiff;
        return suitOrder[b.suit] - suitOrder[a.suit];
      } else {
        const suitDiff = suitOrder[b.suit] - suitOrder[a.suit];
        if (suitDiff !== 0) return suitDiff;
        return rankOrder[b.rank] - rankOrder[a.rank];
      }
    });
  }, [cards, sortBy]);

  return (
    <div className="w-full mb-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your Hand</h2>
          <p className="text-gray-600">
            {cards.length} {cards.length === 1 ? 'card' : 'cards'}
            {selectedForDiscard && selectedForDiscard.size > 0 && (
              <span className="text-orange-600 ml-2">
                ({selectedForDiscard.size} selected for discard)
              </span>
            )}
          </p>
        </div>

        {cards.length > 0 && (
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
            <label className="text-sm font-medium text-gray-700">Sort Hand:</label>
            <button
              onClick={() => setSortBy('rank')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                sortBy === 'rank'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rank
            </button>
            <button
              onClick={() => setSortBy('suit')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                sortBy === 'suit'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              Suit
            </button>
          </div>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
          <p className="text-center text-gray-500">
            Click cards in deck to build your hand
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-13 gap-2">
          {sortedCards.map(card => (
            <HandCard
              key={card.id}
              card={card}
              onClick={onCardClick}
              isSelectedForDiscard={selectedForDiscard?.has(card.id)}
              onToggleDiscard={onToggleDiscard}
            />
          ))}
        </div>
      )}
    </div>
  );
}
