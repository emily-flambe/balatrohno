import { useState, useEffect } from 'react';
import { useDeck } from './hooks/useDeck';
import { DeckControls } from './components/DeckControls';
import { DeckDisplay } from './components/DeckDisplay';
import { HandDisplay } from './components/HandDisplay';
import { CardActionMenu } from './components/CardActionMenu';
import DiscardTable from './components/DiscardTable';
import Calculator from './components/Calculator';

type CardLocation = 'deck' | 'hand' | 'discarded';

function App() {
  const { deck, addCard, removeCard, duplicateCards, undo, redo, canUndo, canRedo } = useDeck();
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [cardLocations, setCardLocations] = useState<Map<string, CardLocation>>(new Map());
  const [actionMenuCard, setActionMenuCard] = useState<string | null>(null);
  const [actionMenuPosition, setActionMenuPosition] = useState({ x: 0, y: 0 });
  const [actionMenuType, setActionMenuType] = useState<'hand' | 'deck' | null>(null);
  const [selectedForDiscard, setSelectedForDiscard] = useState<Set<string>>(new Set());
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    setCardLocations(prev => {
      const newLocations = new Map<string, CardLocation>();
      deck.forEach(card => {
        if (!prev.has(card.id)) {
          newLocations.set(card.id, 'deck');
        } else {
          newLocations.set(card.id, prev.get(card.id)!);
        }
      });
      return newLocations;
    });
  }, [deck]);

  const moveCardToHand = (cardId: string) => {
    setCardLocations(prev => {
      const next = new Map(prev);
      next.set(cardId, 'hand');
      return next;
    });
  };

  const returnCardToDeck = (cardId: string) => {
    setCardLocations(prev => {
      const next = new Map(prev);
      next.set(cardId, 'deck');
      return next;
    });
  };

  const discardCard = (cardId: string) => {
    setCardLocations(prev => {
      const next = new Map(prev);
      next.set(cardId, 'discarded');
      return next;
    });
  };

  const handleAddToHand = () => {
    selectedCards.forEach(id => {
      if (cardLocations.get(id) === 'deck') {
        moveCardToHand(id);
      }
    });
    setSelectedCards(new Set());
  };

  const handleHandCardClick = (id: string) => {
    setActionMenuCard(id);
    setActionMenuPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setActionMenuType('hand');
  };

  const handleToggleDiscard = (id: string) => {
    setSelectedForDiscard(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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

  const handCards = deck.filter(card => cardLocations.get(card.id) === 'hand');
  const deckCards = deck.filter(card => cardLocations.get(card.id) === 'deck');
  const remainingDeck = deckCards; // Cards to draw from (deck excludes hand cards)

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            BalatrOH NO
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Calculator deck={deckCards} />
            </div>

            {selectedForDiscard.size > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <DiscardTable
                  key={`discard-${selectedForDiscard.size}`}
                  selectedForDiscard={Array.from(selectedForDiscard)}
                  remainingDeck={remainingDeck}
                />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-8">
                <HandDisplay
                  cards={handCards}
                  onCardClick={(id) => handleHandCardClick(id)}
                  selectedForDiscard={selectedForDiscard}
                  onToggleDiscard={handleToggleDiscard}
                />
              </div>

              {showAddCard && (
                <div className="mb-8">
                  <DeckControls onAddCard={addCard} />
                </div>
              )}

              <div className="mt-8">
                <DeckDisplay
                  deck={deckCards}
                  selectedCards={selectedCards}
                  onToggleCard={handleToggleCard}
                  onDeleteSelected={handleDeleteSelected}
                  onDuplicateSelected={handleDuplicateSelected}
                  onUndo={undo}
                  onRedo={redo}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onAddCard={() => setShowAddCard(!showAddCard)}
                  onAddToHand={handleAddToHand}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {actionMenuCard && actionMenuType === 'hand' && (
        <CardActionMenu
          position={actionMenuPosition}
          onReturnToDeck={() => {
            returnCardToDeck(actionMenuCard);
            setActionMenuCard(null);
          }}
          onDiscard={() => {
            discardCard(actionMenuCard);
            setActionMenuCard(null);
          }}
          onClose={() => setActionMenuCard(null)}
        />
      )}
    </div>
  )
}

export default App
