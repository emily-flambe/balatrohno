import type { Card as CardType } from '../lib/types';

interface HandCardProps {
  card: CardType;
  onClick: (id: string) => void;
  isSelectedForDiscard?: boolean;
  onToggleDiscard?: (id: string) => void;
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

export function HandCard({ card, onClick, isSelectedForDiscard = false, onToggleDiscard }: HandCardProps) {
  const handleClick = () => {
    if (onToggleDiscard) {
      onToggleDiscard(card.id);
    } else {
      onClick(card.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        border-2 rounded-lg p-3
        transition-colors duration-200
        flex flex-col items-center justify-center
        min-h-20
        cursor-pointer
        hover:border-blue-400
        ${suitColors[card.suit]}
        ${isSelectedForDiscard ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}
      `}
    >
      <span className="text-xl font-bold">{card.rank}</span>
      <span className="text-2xl">{suitSymbols[card.suit]}</span>
    </div>
  );
}
