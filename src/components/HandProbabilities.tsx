import { useState, useEffect, useRef } from 'react';
import type { Card } from '../lib/types';
import { calculateHandProbabilities } from '../lib/handProbabilities';
import { ALL_POKER_HANDS } from '../lib/pokerHands';

interface HandProbabilitiesProps {
  currentHand: Card[];
  selectedForDiscard: Set<string>;
  remainingDeck: Card[];
  onCalculatingChange?: (isCalculating: boolean) => void;
}

export function HandProbabilities({ currentHand, selectedForDiscard, remainingDeck, onCalculatingChange }: HandProbabilitiesProps) {
  const [probabilities, setProbabilities] = useState(() =>
    calculateHandProbabilities(currentHand, selectedForDiscard, remainingDeck)
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const onCalculatingChangeRef = useRef(onCalculatingChange);

  useEffect(() => {
    onCalculatingChangeRef.current = onCalculatingChange;
  }, [onCalculatingChange]);

  useEffect(() => {
    // Only show loading for 5 discards
    if (selectedForDiscard.size === 5) {
      setIsCalculating(true);
      onCalculatingChangeRef.current?.(true);

      // Use setTimeout to ensure UI updates before calculation
      const timer = setTimeout(() => {
        setProbabilities(calculateHandProbabilities(currentHand, selectedForDiscard, remainingDeck));
        setIsCalculating(false);
        onCalculatingChangeRef.current?.(false);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      // For < 5 discards, calculate immediately without loading state
      setProbabilities(calculateHandProbabilities(currentHand, selectedForDiscard, remainingDeck));
      setIsCalculating(false);
      onCalculatingChangeRef.current?.(false);
    }
  }, [currentHand, selectedForDiscard, remainingDeck]);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 h-full relative">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Hand Probabilities
          <span className="block text-xs font-normal text-gray-500">(after discard & draw)</span>
        </h3>
        <div className="space-y-1">
        {ALL_POKER_HANDS.map(handType => {
          const probability = probabilities[handType] || 0;
          const percentage = (probability * 100).toFixed(1);
          const isGuaranteed = probability === 1;
          const isImpossible = probability === 0;

          return (
            <div key={handType} className="flex items-center justify-between gap-4 text-xs">
              <span className={`font-medium whitespace-nowrap ${
                isGuaranteed ? 'text-green-700' :
                isImpossible ? 'text-gray-400' :
                'text-gray-700'
              }`}>
                {handType}
              </span>
              <span className={`font-mono ${
                isGuaranteed ? 'text-green-700 font-bold' :
                isImpossible ? 'text-gray-400' :
                'text-blue-600 font-semibold'
              }`}>
                {percentage}%
              </span>
            </div>
          );
        })}
        </div>
      </div>

      {/* {isCalculating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-md">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
            <span className="text-xs font-medium text-gray-700">Calculating...</span>
          </div>
        </div>
      )} */}
    </div>
  );
}
