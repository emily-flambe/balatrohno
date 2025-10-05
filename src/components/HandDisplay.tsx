import { useState, useMemo } from 'react';
import type { Card as CardType, Rank, Suit } from '../lib/types';
import { HandCard } from './HandCard';
import { HandProbabilities } from './HandProbabilities';

interface HandDisplayProps {
  cards: CardType[];
  onCardClick: (id: string) => void;
  selectedForDiscard?: Set<string>;
  onToggleDiscard?: (id: string) => void;
  onDrawHand: (handSize: number) => void;
  remainingDeck: CardType[];
  onPlay?: () => void;
  onDiscard?: () => void;
  handSize: number;
  setHandSize: (size: number) => void;
  onCalculatingChange?: (isCalculating: boolean) => void;
}

const rankOrder: Record<Rank, number> = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10,
  '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

const suitOrder: Record<Suit, number> = {
  'spades': 4, 'hearts': 3, 'clubs': 2, 'diamonds': 1
};

export function HandDisplay({ cards, onCardClick, selectedForDiscard, onToggleDiscard, onDrawHand, remainingDeck, onPlay, onDiscard, handSize, setHandSize, onCalculatingChange }: HandDisplayProps) {
  const [sortBy, setSortBy] = useState<'rank' | 'suit'>('rank');
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculatingChange = (calculating: boolean) => {
    setIsCalculating(calculating);
    onCalculatingChange?.(calculating);
  };

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
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Hand</h2>
            <p className="text-gray-600">
              {cards.length} {cards.length === 1 ? 'card' : 'cards'}
            </p>
          </div>
          {/* {isCalculating && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
              <span className="text-sm font-medium">Calculating...</span>
            </div>
          )} */}
        </div>

        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
          <label htmlFor="handSize" className="text-sm font-medium text-gray-700">
            Hand size:
          </label>
          <input
            id="handSize"
            type="number"
            min="1"
            max="52"
            value={handSize}
            onChange={(e) => setHandSize(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {cards.length === 0 ? (
          <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 flex flex-col items-center justify-center gap-4">
            <p className="text-center text-gray-500">
              Click Start to draw your initial hand
            </p>
            <button
              onClick={() => onDrawHand(handSize)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-base font-medium"
            >
              Start
            </button>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-4">
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

            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 w-fit">
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

              {selectedForDiscard && selectedForDiscard.size > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onPlay}
                    disabled={!onPlay}
                    className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Play
                  </button>
                  <button
                    onClick={onDiscard}
                    disabled={!onDiscard}
                    className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Discard
                  </button>
                  {selectedForDiscard.size > 5 && (
                    <span className="text-sm text-red-600 font-medium">
                      Maximum 5 cards
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {cards.length > 0 && (
          <div className="xl:w-64 flex-shrink-0">
            <HandProbabilities
              currentHand={cards}
              selectedForDiscard={selectedForDiscard || new Set()}
              remainingDeck={remainingDeck}
              onCalculatingChange={handleCalculatingChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
