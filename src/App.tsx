import { useDeck } from './hooks/useDeck';
import { DeckControls } from './components/DeckControls';
import { DeckDisplay } from './components/DeckDisplay';
import Calculator from './components/Calculator';

function App() {
  const { deck, addCard, removeCard } = useDeck();

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <DeckControls onAddCard={addCard} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <Calculator deck={deck} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <DeckDisplay deck={deck} onRemoveCard={removeCard} />
        </div>
      </div>
    </div>
  )
}

export default App
