import { useState, useEffect, useCallback } from 'react';
import type { Card } from './lib/types';
import { useDeck } from './hooks/useDeck';
import { DeckControls } from './components/DeckControls';
import { DeckDisplay } from './components/DeckDisplay';
import { HandDisplay } from './components/HandDisplay';
import { CardActionMenu } from './components/CardActionMenu';
import DiscardTable from './components/DiscardTable';

type CardLocation = 'deck' | 'hand' | 'discarded';

type GameState = {
  deck: Card[];
  cardLocations: Map<string, CardLocation>;
};

function App() {
  const { deck, addCard, removeCard, duplicateCards, reset: resetDeck } = useDeck();
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [cardLocations, setCardLocations] = useState<Map<string, CardLocation>>(new Map());
  const [actionMenuCard, setActionMenuCard] = useState<string | null>(null);
  const [actionMenuPosition, setActionMenuPosition] = useState({ x: 0, y: 0 });
  const [actionMenuType, setActionMenuType] = useState<'hand' | 'deck' | null>(null);
  const [selectedForDiscard, setSelectedForDiscard] = useState<Set<string>>(new Set());
  const [showAddCard, setShowAddCard] = useState(false);
  const [handSize, setHandSize] = useState<number>(7);
  const [gameHistory, setGameHistory] = useState<GameState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUndoRedoing, setIsUndoRedoing] = useState(false);

  const saveGameState = useCallback(() => {
    const newState: GameState = {
      deck: [...deck],
      cardLocations: new Map(cardLocations)
    };
    setGameHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [deck, cardLocations, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = gameHistory[newIndex];
      setIsUndoRedoing(true);
      setHistoryIndex(newIndex);
      setCardLocations(new Map(state.cardLocations));
    }
  };

  const redo = () => {
    if (historyIndex < gameHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const state = gameHistory[newIndex];
      setIsUndoRedoing(true);
      setHistoryIndex(newIndex);
      setCardLocations(new Map(state.cardLocations));
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < gameHistory.length - 1;

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

  useEffect(() => {
    if (isUndoRedoing) {
      setIsUndoRedoing(false);
      return;
    }
    if (handCards.length > 0) {
      saveGameState();
    }
  }, [cardLocations]);

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

  const handleDrawHand = (handSize: number) => {
    const availableDeckCards = deckCards.filter(card => !selectedCards.has(card.id));
    const drawCount = Math.min(handSize, availableDeckCards.length);

    // Fisher-Yates shuffle for random sample
    const shuffled = [...availableDeckCards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Take first drawCount cards and move to hand
    const cardsToMove = shuffled.slice(0, drawCount);
    setCardLocations(prev => {
      const next = new Map(prev);
      cardsToMove.forEach(card => {
        next.set(card.id, 'hand');
      });
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
        // Balatro rule: maximum 5 discards
        if (next.size >= 5) {
          return prev; // Don't allow more than 5 selections
        }
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

  const handlePlay = () => {
    // Get selected cards and draw count
    const selectedCardIds = Array.from(selectedForDiscard);
    const drawCount = selectedCardIds.length;

    // Remove selected cards from hand (move to discarded for now, can track play history later)
    setCardLocations(prev => {
      const next = new Map(prev);
      selectedCardIds.forEach(id => {
        next.set(id, 'discarded');
      });
      return next;
    });

    // Draw replacement cards from deck
    const availableDeckCards = deckCards.filter(card => !selectedCards.has(card.id));
    const actualDrawCount = Math.min(drawCount, availableDeckCards.length);

    // Fisher-Yates shuffle for random sample
    const shuffled = [...availableDeckCards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Take first actualDrawCount cards and move to hand
    const cardsToMove = shuffled.slice(0, actualDrawCount);
    setCardLocations(prev => {
      const next = new Map(prev);
      cardsToMove.forEach(card => {
        next.set(card.id, 'hand');
      });
      return next;
    });

    // Clear selection
    setSelectedForDiscard(new Set());
  };

  const handleDiscard = () => {
    // Get selected cards and draw count
    const selectedCardIds = Array.from(selectedForDiscard);
    const drawCount = selectedCardIds.length;

    // Remove selected cards from hand (move to discarded)
    setCardLocations(prev => {
      const next = new Map(prev);
      selectedCardIds.forEach(id => {
        next.set(id, 'discarded');
      });
      return next;
    });

    // Draw replacement cards from deck
    const availableDeckCards = deckCards.filter(card => !selectedCards.has(card.id));
    const actualDrawCount = Math.min(drawCount, availableDeckCards.length);

    // Fisher-Yates shuffle for random sample
    const shuffled = [...availableDeckCards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Take first actualDrawCount cards and move to hand
    const cardsToMove = shuffled.slice(0, actualDrawCount);
    setCardLocations(prev => {
      const next = new Map(prev);
      cardsToMove.forEach(card => {
        next.set(card.id, 'hand');
      });
      return next;
    });

    // Clear selection
    setSelectedForDiscard(new Set());
  };

  const handleReset = () => {
    resetDeck();
    setSelectedCards(new Set());
    setCardLocations(new Map());
    setActionMenuCard(null);
    setActionMenuType(null);
    setSelectedForDiscard(new Set());
    setShowAddCard(false);
    setGameHistory([]);
    setHistoryIndex(-1);
  };

  const handCards = deck.filter(card => cardLocations.get(card.id) === 'hand');
  const deckCards = deck.filter(card => cardLocations.get(card.id) === 'deck');
  const remainingDeck = deckCards; // Cards to draw from (deck excludes hand cards)

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-1">
      <div className="max-w-[1450px] mx-auto">
        <div className="relative text-center mb-8">
          <div className="absolute right-0 top-0">
            <a
              href="https://github.com/emily-flambe/balatrohno"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="View on GitHub"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            BalatrOH NO
          </h1>
          <p className="text-gray-600 mt-2">
            a perfectly reasonable tool
          </p>
        </div>

        {handCards.length > 0 && (
          <div className="flex justify-end gap-2 mb-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Redo
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Reset
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
          <div className="lg:w-[26rem] flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <DiscardTable
                key={`discard-${selectedForDiscard.size}`}
                selectedForDiscard={Array.from(selectedForDiscard)}
                remainingDeck={remainingDeck}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="mb-8">
                <HandDisplay
                  cards={handCards}
                  onCardClick={(id) => handleHandCardClick(id)}
                  selectedForDiscard={selectedForDiscard}
                  onToggleDiscard={handleToggleDiscard}
                  onDrawHand={handleDrawHand}
                  remainingDeck={remainingDeck}
                  onPlay={handlePlay}
                  onDiscard={handleDiscard}
                  handSize={handSize}
                  setHandSize={setHandSize}
                />
              </div>

              <div className="mt-8">
                <DeckDisplay
                  deck={deckCards}
                  selectedCards={selectedCards}
                  onToggleCard={handleToggleCard}
                  onDeleteSelected={handleDeleteSelected}
                  onDuplicateSelected={handleDuplicateSelected}
                  onAddCard={() => setShowAddCard(!showAddCard)}
                  onAddToHand={handleAddToHand}
                  showAddCard={showAddCard}
                  addCardComponent={<DeckControls onAddCard={addCard} />}
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
