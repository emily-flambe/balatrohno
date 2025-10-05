import { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Only show loading for 5 discards
    if (selectedForDiscard.size === 5) {
      setIsCalculating(true);
      onCalculatingChange?.(true);

      // Defer calculation to next tick so React can render loading state
      const timer = setTimeout(() => {
        setProbabilities(calculateHandProbabilities(currentHand, selectedForDiscard, remainingDeck));
        setIsCalculating(false);
        onCalculatingChange?.(false);
      }, 0);

      return () => clearTimeout(timer);
    } else {
      // For < 5 discards, calculate immediately without loading state
      setProbabilities(calculateHandProbabilities(currentHand, selectedForDiscard, remainingDeck));
      setIsCalculating(false);
      onCalculatingChange?.(false);
    }
  }, [currentHand, selectedForDiscard, remainingDeck, onCalculatingChange]);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 h-full">
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
  );
}
