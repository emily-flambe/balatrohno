import type { Card as CardType } from '../lib/types';
import { Card } from './Card';

interface DeckDisplayProps {
  deck: CardType[];
  onRemoveCard: (id: string) => void;
}

export function DeckDisplay({ deck, onRemoveCard }: DeckDisplayProps) {
  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Current Deck
        </h2>
        <p className="text-gray-600">
          {deck.length} {deck.length === 1 ? 'card' : 'cards'}
        </p>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-13 gap-2">
        {deck.map(card => (
          <Card
            key={card.id}
            card={card}
            onRemove={onRemoveCard}
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
