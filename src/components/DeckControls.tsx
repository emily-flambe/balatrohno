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
  const [selectedSuit, setSelectedSuit] = useState<Suit>('hearts');

  const handleAddCard = () => {
    const newCard: Card = {
      id: `${Date.now()}-${Math.random()}`,
      rank: selectedRank,
      suit: selectedSuit
    };
    onAddCard(newCard);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add Card to Deck</h2>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-32">
          <label htmlFor="rank" className="block text-sm font-medium text-gray-700 mb-1">
            Rank
          </label>
          <select
            id="rank"
            value={selectedRank}
            onChange={(e) => setSelectedRank(e.target.value as Rank)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ranks.map(rank => (
              <option key={rank} value={rank}>{rank}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-32">
          <label htmlFor="suit" className="block text-sm font-medium text-gray-700 mb-1">
            Suit
          </label>
          <select
            id="suit"
            value={selectedSuit}
            onChange={(e) => setSelectedSuit(e.target.value as Suit)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {suits.map(suit => (
              <option key={suit} value={suit}>{suitLabels[suit]}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAddCard}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Add Card
        </button>
      </div>
    </div>
  );
}
