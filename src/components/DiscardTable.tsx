import { useState } from 'react';
import type { Card, Rank, Suit } from '../lib/types';

interface DiscardTableProps {
  selectedForDiscard: string[];
  remainingDeck: Card[];
}

const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

const suitLabels: Record<Suit, string> = {
  hearts: '♥ Hearts',
  diamonds: '♦ Diamonds',
  clubs: '♣ Clubs',
  spades: '♠ Spades'
};

export default function DiscardTable({ selectedForDiscard, remainingDeck }: DiscardTableProps) {
  const [isSpecificCardsExpanded, setIsSpecificCardsExpanded] = useState(false);

  if (selectedForDiscard.length === 0) {
    return (
      <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">(select cards for quick maths)</p>
      </div>
    );
  }

  const deckSize = remainingDeck.length;
  const numDiscards = selectedForDiscard.length; // Total cards to draw from deck
  const nValues = Array.from({ length: Math.min(numDiscards, 4) }, (_, i) => i + 1); // Min matches: 1, 2, 3, 4

  // Calculate P(at least minMatches of targetCards when drawing numDiscards cards)
  const calculateProbability = (targetCards: Card[], minMatches: number): string => {
    const drawCount = numDiscards;

    if (targetCards.length === 0 || deckSize === 0 || drawCount > deckSize) {
      return '0.0%';
    }

    const k = targetCards.length; // Number of target cards in deck
    const nonTargetCards = deckSize - k;

    let probability = 0;
    // Sum P(exactly i matches) for i = minMatches to min(drawCount, k)
    for (let i = minMatches; i <= Math.min(drawCount, k); i++) {
      const ways = combination(k, i) * combination(nonTargetCards, drawCount - i);
      const total = combination(deckSize, drawCount);
      probability += ways / total;
    }

    return `${(probability * 100).toFixed(1)}%`;
  };

  const combination = (n: number, r: number): number => {
    if (r > n || r < 0) return 0;
    if (r === 0 || r === n) return 1;

    let result = 1;
    for (let i = 1; i <= r; i++) {
      result = result * (n - i + 1) / i;
    }
    return result;
  };

  const getSuitCards = (suit: Suit): Card[] => {
    return remainingDeck.filter(card => card.suit === suit);
  };

  const getRankCards = (rank: Rank): Card[] => {
    return remainingDeck.filter(card => card.rank === rank);
  };

  const getSpecificCard = (rank: Rank, suit: Suit): Card | undefined => {
    return remainingDeck.find(card => card.rank === rank && card.suit === suit);
  };

  // Calculate P(at least minMatches cards of same rank when drawing numDiscards cards)
  const calculateNOfAKindProbability = (minMatches: number): string => {
    const drawCount = numDiscards;

    if (deckSize === 0 || drawCount > deckSize || minMatches > drawCount) {
      return '0.0%';
    }

    if (minMatches === 1) {
      return '100.0%'; // Always have at least 1 card
    }

    // Count ranks available (needed for all minMatches >= 2)
    const rankCounts = new Map<Rank, number>();
    for (const card of remainingDeck) {
      rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
    }

    if (minMatches === 2) {
      // P(at least one pair) = 1 - P(no pairs) = 1 - P(all different ranks)

      const numRanks = rankCounts.size;

      if (drawCount > numRanks) {
        // Pigeonhole: must have a pair
        return '100.0%';
      }

      // Calculate P(all different ranks)
      // Need to choose drawCount ranks, then 1 card from each rank

      // Helper: calculate number of ways to choose 1 card from each of a set of ranks
      const ranksArray = Array.from(rankCounts.entries());

      // Generate all combinations of drawCount ranks
      const countWaysAllDifferent = (rankIndex: number, cardsLeft: number, product: number): number => {
        if (cardsLeft === 0) {
          return product;
        }
        if (rankIndex >= ranksArray.length) {
          return 0;
        }
        if (ranksArray.length - rankIndex < cardsLeft) {
          // Not enough ranks left
          return 0;
        }

        // Include this rank: choose 1 card from it
        const withThis = countWaysAllDifferent(rankIndex + 1, cardsLeft - 1, product * ranksArray[rankIndex][1]);

        // Skip this rank
        const withoutThis = countWaysAllDifferent(rankIndex + 1, cardsLeft, product);

        return withThis + withoutThis;
      };

      const waysAllDifferent = countWaysAllDifferent(0, drawCount, 1);
      const totalWays = combination(deckSize, drawCount);
      const probAllDifferent = waysAllDifferent / totalWays;
      const probPair = 1 - probAllDifferent;

      return `${(probPair * 100).toFixed(1)}%`;
    }

    // For minMatches >= 3, calculate P(at least one rank has minMatches or more cards)
    // These events are mutually exclusive (can't have 3+ Aces AND 3+ Kings when drawing only 3 cards)
    // So we can sum the individual probabilities

    const ranksWithEnough = Array.from(rankCounts.entries()).filter(([, count]) => count >= minMatches);

    if (ranksWithEnough.length === 0) {
      return '0.0%';
    }

    let totalProb = 0;

    for (const [, k] of ranksWithEnough) {
      // P(at least minMatches of this specific rank when drawing drawCount cards)
      for (let i = minMatches; i <= Math.min(drawCount, k); i++) {
        const ways = combination(k, i) * combination(deckSize - k, drawCount - i);
        const total = combination(deckSize, drawCount);
        totalProb += ways / total;
      }
    }

    // Cap at 100% in case of floating point errors
    return `${(Math.min(totalProb, 1.0) * 100).toFixed(1)}%`;
  };

  return (
    <div className="w-full">
      <div>
        <div className="px-4 py-3 bg-gray-100 rounded-lg mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Odds Of Drawing Stuff
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            These odds apply to the {numDiscards} cards to be drawn after discard.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                  Category
                </th>
                {nValues.map(n => (
                  <th key={n} className="border border-gray-300 px-2 py-3 text-center font-semibold text-gray-700">
                    ≥{n}
                  </th>
                ))}
              </tr>
            </thead>
        <tbody>
          {/* N of a Kind Row */}
          <tr className="hover:bg-gray-50">
            <td className="border border-gray-300 px-4 py-2 font-semibold">
              N of a Kind
            </td>
            {nValues.map(n => (
              <td key={n} className="border border-gray-300 px-2 py-2 text-center">
                {calculateNOfAKindProbability(n)}
              </td>
            ))}
          </tr>

          {/* Suits Section */}
          <tr className="bg-gray-50">
            <td colSpan={nValues.length + 1} className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">
              Suits
            </td>
          </tr>
          {suits.map(suit => {
            const suitCards = getSuitCards(suit);
            return (
              <tr key={suit} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {suitLabels[suit]} ({suitCards.length})
                </td>
                {nValues.map(n => (
                  <td key={n} className="border border-gray-300 px-2 py-2 text-center">
                    {calculateProbability(suitCards, n)}
                  </td>
                ))}
              </tr>
            );
          })}

          {/* Ranks Section */}
          <tr className="bg-gray-50">
            <td colSpan={nValues.length + 1} className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">
              Ranks
            </td>
          </tr>
          {ranks.map(rank => {
            const rankCards = getRankCards(rank);
            return (
              <tr key={rank} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {rank} ({rankCards.length})
                </td>
                {nValues.map(n => (
                  <td key={n} className="border border-gray-300 px-2 py-2 text-center">
                    {calculateProbability(rankCards, n)}
                  </td>
                ))}
              </tr>
            );
          })}

          {/* Specific Cards Section */}
          <tr className="bg-gray-50">
            <td colSpan={nValues.length + 1} className="border border-gray-300">
              <button
                onClick={() => setIsSpecificCardsExpanded(!isSpecificCardsExpanded)}
                className="w-full px-4 py-2 text-left font-semibold text-gray-800 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <span>Specific Cards</span>
                <span className="text-gray-500">
                  {isSpecificCardsExpanded ? '▼' : '▶'}
                </span>
              </button>
            </td>
          </tr>
          {isSpecificCardsExpanded && ranks.map(rank =>
            suits.map(suit => {
              const specificCard = getSpecificCard(rank, suit);
              const cards = specificCard ? [specificCard] : [];
              return (
                <tr key={`${rank}-${suit}`} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 pl-8">
                    {rank} of {suitLabels[suit]} ({cards.length})
                  </td>
                  {nValues.map(n => (
                    <td key={n} className="border border-gray-300 px-2 py-2 text-center">
                      {calculateProbability(cards, n)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      </div>
      </div>
    </div>
  );
}
