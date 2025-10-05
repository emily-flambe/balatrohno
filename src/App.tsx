import { useState } from 'react';
import { useDeck } from './hooks/useDeck';
import { DeckControls } from './components/DeckControls';
import { DeckDisplay } from './components/DeckDisplay';
import Calculator from './components/Calculator';

function App() {
  const { deck, addCard, removeCard, duplicateCards } = useDeck();
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const handleToggleCard = (id: string) => {
    setSelectedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDeleteSelected = () => {
    selectedCards.forEach(id => removeCard(id));
    setSelectedCards(new Set());
  };

  const handleDuplicateSelected = () => {
    duplicateCards(Array.from(selectedCards));
    setSelectedCards(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Balatro Card Probability Calculator
          </h1>
          <p className="text-gray-600">
            Quick probability calculator for Balatro players
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Calculator deck={deck} />
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <DeckControls onAddCard={addCard} />

              <div className="mt-8">
                <DeckDisplay
                  deck={deck}
                  selectedCards={selectedCards}
                  onToggleCard={handleToggleCard}
                  onDeleteSelected={handleDeleteSelected}
                  onDuplicateSelected={handleDuplicateSelected}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
