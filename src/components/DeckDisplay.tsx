import { useState, useMemo } from 'react';
import type { Card as CardType, Rank, Suit } from '../lib/types';
import { DeckCard } from './DeckCard';

interface DeckDisplayProps {
  deck: CardType[];
  selectedCards: Set<string>;
  onToggleCard: (id: string) => void;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onAddCard?: () => void;
  onAddToHand?: () => void;
  showAddCard?: boolean;
  addCardComponent?: React.ReactNode;
}

export function DeckDisplay({
  deck,
  selectedCards,
  onToggleCard,
  onDeleteSelected,
  onDuplicateSelected,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onAddCard,
  onAddToHand,
  showAddCard,
  addCardComponent
}: DeckDisplayProps) {
  const [rankFilters, setRankFilters] = useState<Set<Rank>>(new Set());
  const [suitFilters, setSuitFilters] = useState<Set<Suit>>(new Set());
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);

  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

  const filteredDeck = useMemo(() => {
    return deck.filter(card => {
      const rankMatch = rankFilters.size === 0 || rankFilters.has(card.rank);
      const suitMatch = suitFilters.size === 0 || suitFilters.has(card.suit);
      return rankMatch && suitMatch;
    });
  }, [deck, rankFilters, suitFilters]);

  const hasFilters = rankFilters.size > 0 || suitFilters.size > 0;
  const hasSelection = selectedCards.size > 0;
  const allVisibleSelected = filteredDeck.length > 0 && filteredDeck.every(card => selectedCards.has(card.id));

  const toggleRankFilter = (rank: Rank) => {
    const newFilters = new Set(rankFilters);
    if (newFilters.has(rank)) {
      newFilters.delete(rank);
    } else {
      newFilters.add(rank);
    }
    setRankFilters(newFilters);
  };

  const toggleSuitFilter = (suit: Suit) => {
    const newFilters = new Set(suitFilters);
    if (newFilters.has(suit)) {
      newFilters.delete(suit);
    } else {
      newFilters.add(suit);
    }
    setSuitFilters(newFilters);
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      // Deselect all visible cards
      filteredDeck.forEach(card => {
        if (selectedCards.has(card.id)) {
          onToggleCard(card.id);
        }
      });
    } else {
      // Select all visible cards
      filteredDeck.forEach(card => {
        if (!selectedCards.has(card.id)) {
          onToggleCard(card.id);
        }
      });
    }
  };

  const clearFilters = () => {
    setRankFilters(new Set());
    setSuitFilters(new Set());
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Current Deck
              </h2>
              <p className="text-gray-600">
                {deck.length} {deck.length === 1 ? 'card' : 'cards'} total
                {hasFilters && ` (showing ${filteredDeck.length})`}
                {hasSelection && ` - ${selectedCards.size} selected`}
              </p>
              {onAddCard && (
                <button
                  onClick={onAddCard}
                  className="mt-2 w-10 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-xl font-bold"
                  title="Add Card to Deck"
                >
                  +
                </button>
              )}
            </div>
            {showAddCard && addCardComponent && (
              <div className="mt-8">
                {addCardComponent}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              Undo
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              Redo
            </button>
          </div>
        </div>

        {hasSelection && (
          <div className="flex justify-end gap-2">
            {onAddToHand && (
              <button
                onClick={onAddToHand}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Add to Hand"
              >
                Add to Hand
              </button>
            )}
            <button
              onClick={onDuplicateSelected}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Duplicate
            </button>
            <button
              onClick={onDeleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Discard
            </button>
          </div>
        )}
      </div>

      {/* Filter Section */}
      <div className="mb-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="p-4 flex items-center justify-between">
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            aria-label={isFilterExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            <span className={`text-sm font-semibold text-gray-500 inline-block transition-transform ${isFilterExpanded ? 'rotate-90' : ''}`}>
              &gt;
            </span>
            <h3 className="text-sm font-semibold text-gray-700">
              Filter Cards Displayed
              {hasFilters && <span className="ml-2 text-xs text-blue-600">({rankFilters.size + suitFilters.size} active)</span>}
            </h3>
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {isFilterExpanded && (
          <div className="px-4 pb-4">
            {/* Rank Filters */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-2">Rank</label>
              <div className="flex flex-wrap gap-1">
                {ranks.map(rank => (
                  <button
                    key={rank}
                    onClick={() => toggleRankFilter(rank)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      rankFilters.has(rank)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {rank}
                  </button>
                ))}
              </div>
            </div>

            {/* Suit Filters */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Suit</label>
              <div className="flex flex-wrap gap-1">
                {suits.map(suit => (
                  <button
                    key={suit}
                    onClick={() => toggleSuitFilter(suit)}
                    className={`px-3 py-1 text-xs rounded border transition-colors ${
                      suitFilters.has(suit)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {suit.charAt(0).toUpperCase() + suit.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Select All Button */}
      {filteredDeck.length > 0 && (
        <div className="mb-3">
          <button
            onClick={toggleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {allVisibleSelected ? 'Deselect all' : 'Select all'}
          </button>
          {hasFilters && (
            <div className="mt-2 text-xs text-yellow-700">
              Filters have been applied and some cards may be hidden from view.{' '}
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {filteredDeck.map(card => (
          <DeckCard
            key={card.id}
            card={card}
            isSelected={selectedCards.has(card.id)}
            onToggle={onToggleCard}
          />
        ))}
      </div>

      {deck.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No cards in deck. Add cards using the controls above.
        </p>
      )}

      {deck.length > 0 && filteredDeck.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No cards match the current filters.
        </p>
      )}
    </div>
  );
}
