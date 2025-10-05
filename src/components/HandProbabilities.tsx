import { useMemo } from 'react';
import type { Card } from '../lib/types';
import { calculateHandProbabilities } from '../lib/handProbabilities';
import { ALL_POKER_HANDS } from '../lib/pokerHands';

interface HandProbabilitiesProps {
  currentHand: Card[];
  selectedForDiscard: Set<string>;
  remainingDeck: Card[];
}

export function HandProbabilities({ currentHand, selectedForDiscard, remainingDeck }: HandProbabilitiesProps) {
  const probabilities = useMemo(() => {
    return calculateHandProbabilities(currentHand, selectedForDiscard, remainingDeck);
  }, [currentHand, selectedForDiscard, remainingDeck]);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
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
            <div key={handType} className="flex items-center justify-between text-xs">
              <span className={`font-medium ${
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
