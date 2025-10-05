import { useState } from 'react';
import type { Rank, Suit, Card } from '../lib/types';

interface DeckControlsProps {
  onAddCard: (card: Card) => void;
}

const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

const suitLabels: Record<Suit, string> = {
  hearts: '♥ Hearts',
  diamonds: '♦ Diamonds',
  clubs: '♣ Clubs',
  spades: '♠ Spades'
};

export function DeckControls({ onAddCard }: DeckControlsProps) {
  const [selectedRank, setSelectedRank] = useState<Rank>('A');
  const [selectedSuit, setSelectedSuit] = useState<Suit>('spades');
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddCard = () => {
    for (let i = 0; i < quantity; i++) {
      const newCard: Card = {
        id: `${Date.now()}-${Math.random()}-${i}`,
        rank: selectedRank,
        suit: selectedSuit
      };
      onAddCard(newCard);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex items-center gap-2">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity:
        </label>
        <input
          id="quantity"
          type="number"
          min="1"
          max="52"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="rank" className="text-sm font-medium text-gray-700">
          Rank:
        </label>
        <select
          id="rank"
          value={selectedRank}
          onChange={(e) => setSelectedRank(e.target.value as Rank)}
          className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ranks.map(rank => (
            <option key={rank} value={rank}>{rank}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="suit" className="text-sm font-medium text-gray-700">
          Suit:
        </label>
        <select
          id="suit"
          value={selectedSuit}
          onChange={(e) => setSelectedSuit(e.target.value as Suit)}
          className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {suits.map(suit => (
            <option key={suit} value={suit}>{suitLabels[suit]}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAddCard}
        className="px-4 py-1 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
      >
        Add To Deck
      </button>
    </div>
  );
}
