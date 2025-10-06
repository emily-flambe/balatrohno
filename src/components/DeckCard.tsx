import type { Card as CardType } from '../lib/types';

interface DeckCardProps {
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

export function DeckCard({ card, isSelected, onToggle }: DeckCardProps) {
  return (
    <div
      onClick={() => onToggle(card.id)}
      className={`
        w-[66px]
        border-2 rounded-lg p-2
        transition-colors duration-200
        flex flex-col items-center justify-center
        aspect-[5/7]
        cursor-pointer hover:border-blue-400
        ${suitColors[card.suit]}
        ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}
      `}
    >
      <span className="text-lg font-bold">{card.rank}</span>
      <span className="text-xl">{suitSymbols[card.suit]}</span>
    </div>
  );
}
