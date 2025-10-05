import { useState } from 'react'
import type { Card, Rank, Suit } from '../lib/types'

interface CalculatorProps {
  deck: Card[]
}

interface CalculationResult {
  probability: number
  percentage: string
}

export default function Calculator({ deck }: CalculatorProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [drawCount, setDrawCount] = useState<number>(5)
  const [minMatches, setMinMatches] = useState<number>(1)
  const [rank, setRank] = useState<Rank | 'any'>('any')
  const [suit, setSuit] = useState<Suit | 'any'>('any')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const suits = ['hearts', 'diamonds', 'clubs', 'spades']

  const combination = (n: number, r: number): number => {
    if (r > n || r < 0) return 0;
    if (r === 0 || r === n) return 1;

    let result = 1;
    for (let i = 1; i <= r; i++) {
      result = result * (n - i + 1) / i;
    }
    return result;
  };

  const calculateProbability = (): number => {
    const targetCards = deck.filter(card => {
      const rankMatch = rank === 'any' || card.rank === rank;
      const suitMatch = suit === 'any' || card.suit === suit;
      return rankMatch && suitMatch;
    });

    const deckSize = deck.length;
    const k = targetCards.length;
    const n = drawCount;

    if (k === 0 || deckSize === 0 || n > deckSize) {
      return 0;
    }

    const nonTargetCards = deckSize - k;

    let probability = 0;
    for (let i = minMatches; i <= Math.min(n, k); i++) {
      const ways = combination(k, i) * combination(nonTargetCards, n - i);
      const total = combination(deckSize, n);
      probability += ways / total;
    }

    return probability;
  };

  const handleCalculate = () => {
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      const probability = calculateProbability();
      const percentage = `${(probability * 100).toFixed(1)}%`;

      setResult({ probability, percentage });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error')
    } finally {
      setLoading(false)
    }
  }

  const isValid = drawCount > 0 && minMatches > 0 && drawCount <= deck.length && minMatches <= drawCount

  return (
    <div className="w-full">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg mb-2"
      >
        <h2 className="text-lg font-semibold text-gray-800">Calculate Probability</h2>
        <span className="text-gray-600">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
      <div className="space-y-4">
        {/* Draw Count */}
        <div>
          <label htmlFor="drawCount" className="block text-sm font-medium mb-1">
            Draw how many cards?
          </label>
          <input
            id="drawCount"
            type="number"
            min="1"
            max={deck.length}
            value={drawCount}
            onChange={(e) => setDrawCount(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Rank Selection */}
        <div>
          <label htmlFor="rank" className="block text-sm font-medium mb-1">
            Rank
          </label>
          <select
            id="rank"
            value={rank}
            onChange={(e) => setRank(e.target.value as Rank | 'any')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="any">Any</option>
            {ranks.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Suit Selection */}
        <div>
          <label htmlFor="suit" className="block text-sm font-medium mb-1">
            Suit
          </label>
          <select
            id="suit"
            value={suit}
            onChange={(e) => setSuit(e.target.value as Suit | 'any')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="any">Any</option>
            {suits.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Min Matches */}
        <div>
          <label htmlFor="minMatches" className="block text-sm font-medium mb-1">
            At least how many matches?
          </label>
          <input
            id="minMatches"
            type="number"
            min="1"
            max={drawCount}
            value={minMatches}
            onChange={(e) => setMinMatches(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={!isValid || loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Calculating...' : 'Calculate'}
        </button>

        {/* Validation Errors */}
        {!isValid && (
          <div className="text-sm text-red-600 space-y-1">
            {drawCount > deck.length && <p>Cannot draw more cards than exist in deck</p>}
            {minMatches > drawCount && <p>Minimum matches cannot exceed draw count</p>}
            {drawCount < 1 && <p>Draw count must be at least 1</p>}
            {minMatches < 1 && <p>Minimum matches must be at least 1</p>}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="bg-green-50 border border-green-200 text-green-900 px-6 py-4 rounded-md space-y-2">
            <div className="text-4xl font-bold">{result.percentage}</div>
            <div className="text-sm">
              Probability of drawing at least {minMatches} {
                rank !== 'any' && suit !== 'any'
                  ? `${rank} of ${suit}`
                  : rank !== 'any'
                    ? `${rank}s`
                    : suit !== 'any'
                      ? suit.charAt(0).toUpperCase() + suit.slice(1)
                      : 'cards'
              } in {drawCount} cards
            </div>
            <div className="text-xs text-green-700">
              (probability: {result.probability < 0.0001 ? result.probability.toExponential(4) : result.probability.toFixed(4)})
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
