import type { Card as CardType } from '../lib/types';

interface CardProps {
  card: CardType;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const suitSymbols: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

const suitColors: Record<string, string> = {
  hearts: 'text-red-600',
  diamonds: 'text-red-600',
  clubs: 'text-gray-900',
  spades: 'text-gray-900'
};

export function Card({ card, isSelected, onToggle }: CardProps) {
  return (
    <div className="relative">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggle(card.id)}
        className="absolute top-1 left-1 w-4 h-4 cursor-pointer z-10"
      />
      <div
        className={`
          border-2 rounded-lg p-3
          transition-colors duration-200
          flex flex-col items-center justify-center
          min-h-20
          ${suitColors[card.suit]}
          ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}
        `}
      >
        <span className="text-xl font-bold">{card.rank}</span>
        <span className="text-2xl">{suitSymbols[card.suit]}</span>
      </div>
    </div>
  );
}
