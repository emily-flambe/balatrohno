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
}

const rankOrder: Record<Rank, number> = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10,
  '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

const suitOrder: Record<Suit, number> = {
  'spades': 4, 'hearts': 3, 'clubs': 2, 'diamonds': 1
};

export function HandDisplay({ cards, onCardClick, selectedForDiscard, onToggleDiscard, onDrawHand, remainingDeck, onPlay, onDiscard }: HandDisplayProps) {
  const [sortBy, setSortBy] = useState<'rank' | 'suit'>('rank');
  const [handSize, setHandSize] = useState<number>(7);

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
      <div className="flex gap-6">
        {/* Left side: Hand display and controls */}
        <div className="flex-1">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Hand</h2>
            <p className="text-gray-600">
              {cards.length} {cards.length === 1 ? 'card' : 'cards'}
            </p>
          </div>

          {cards.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
              <p className="text-center text-gray-500">
                Click cards in deck to build your hand
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-13 gap-2 mb-4">
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
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2 w-fit">
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
            <button
              onClick={() => onDrawHand(handSize)}
              className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Draw Hand
            </button>
          </div>
        </div>

        {/* Right side: Hand probabilities */}
        {cards.length > 0 && (
          <div className="w-64 flex-shrink-0">
            <HandProbabilities
              currentHand={cards}
              selectedForDiscard={selectedForDiscard || new Set()}
              remainingDeck={remainingDeck}
            />
          </div>
        )}
      </div>
    </div>
  );
}
