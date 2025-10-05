import { useEffect, useRef } from 'react';

interface CardActionMenuProps {
  position: { x: number; y: number };
  onReturnToDeck?: () => void;
  onDiscard?: () => void;
  onAddToHand?: () => void;
  onClose: () => void;
}

export function CardActionMenu({ position, onReturnToDeck, onDiscard, onAddToHand, onClose }: CardActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleReturnToDeck = () => {
    onReturnToDeck?.();
    onClose();
  };

  const handleDiscard = () => {
    onDiscard?.();
    onClose();
  };

  const handleAddToHand = () => {
    onAddToHand?.();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-2 flex flex-col gap-2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {onAddToHand && (
        <button
          onClick={handleAddToHand}
          className="px-4 py-2 min-h-[44px] bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
        >
          Add to Hand
        </button>
      )}
      {onReturnToDeck && (
        <button
          onClick={handleReturnToDeck}
          className="px-4 py-2 min-h-[44px] bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
        >
          Return to Deck
        </button>
      )}
      {onDiscard && (
        <button
          onClick={handleDiscard}
          className="px-4 py-2 min-h-[44px] bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-200 whitespace-nowrap"
        >
          Discard
        </button>
      )}
    </div>
  );
}
