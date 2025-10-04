import type { Card as CardType } from '../lib/types';

interface CardProps {
  card: CardType;
  onRemove: (id: string) => void;
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

export function Card({ card, onRemove }: CardProps) {
  return (
    <button
      onClick={() => onRemove(card.id)}
      className={`
        border-2 border-gray-300 rounded-lg p-3
        hover:border-red-500 hover:bg-red-50
        transition-colors duration-200
        cursor-pointer
        flex flex-col items-center justify-center
        min-h-20
        ${suitColors[card.suit]}
      `}
    >
      <span className="text-xl font-bold">{card.rank}</span>
      <span className="text-2xl">{suitSymbols[card.suit]}</span>
    </button>
  );
}
