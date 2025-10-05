import type { Card as CardType } from '../lib/types';
import { Card } from './Card';

interface DeckDisplayProps {
  deck: CardType[];
  selectedCards: Set<string>;
  onToggleCard: (id: string) => void;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
}

export function DeckDisplay({
  deck,
  selectedCards,
  onToggleCard,
  onDeleteSelected,
  onDuplicateSelected
}: DeckDisplayProps) {
  const hasSelection = selectedCards.size > 0;

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Current Deck
          </h2>
          <p className="text-gray-600">
            {deck.length} {deck.length === 1 ? 'card' : 'cards'}
            {hasSelection && ` (${selectedCards.size} selected)`}
          </p>
        </div>

        {hasSelection && (
          <div className="flex gap-2">
            <button
              onClick={onDuplicateSelected}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Duplicate
            </button>
            <button
              onClick={onDeleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-13 gap-2">
        {deck.map(card => (
          <Card
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
    </div>
  );
}
