import { useState } from 'react'
import type { Card, CalculationRequest, CalculationResponse } from '../lib/types'

interface CalculatorProps {
  deck: Card[]
}

export default function Calculator({ deck }: CalculatorProps) {
  const [drawCount, setDrawCount] = useState<number>(5)
  const [minMatches, setMinMatches] = useState<number>(1)
  const [searchType, setSearchType] = useState<'rank' | 'suit' | 'color'>('rank')
  const [searchValue, setSearchValue] = useState<string>('A')
  const [result, setResult] = useState<CalculationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const suits = ['hearts', 'diamonds', 'clubs', 'spades']
  const colors = ['red', 'black']

  const getSearchOptions = () => {
    if (searchType === 'rank') return ranks
    if (searchType === 'suit') return suits
    return colors
  }

  const handleCalculate = async () => {
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      const request: CalculationRequest = {
        deck,
        drawCount,
        minMatches,
        searchType,
        searchValue,
      }

      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Calculation failed')
        return
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const isValid = drawCount > 0 && minMatches > 0 && drawCount <= deck.length && minMatches <= drawCount

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Calculate Probability</h2>

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

        {/* Search Type */}
        <div>
          <label htmlFor="searchType" className="block text-sm font-medium mb-1">
            Search by
          </label>
          <select
            id="searchType"
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value as 'rank' | 'suit' | 'color')
              setSearchValue(e.target.value === 'rank' ? 'A' : e.target.value === 'suit' ? 'hearts' : 'red')
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rank">Rank</option>
            <option value="suit">Suit</option>
            <option value="color">Color</option>
          </select>
        </div>

        {/* Search Value */}
        <div>
          <label htmlFor="searchValue" className="block text-sm font-medium mb-1">
            Which {searchType}?
          </label>
          <select
            id="searchValue"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {getSearchOptions().map((option) => (
              <option key={option} value={option}>
                {option}
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
          {loading ? 'Calculating...' : 'Calculate Probability'}
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
              Probability of drawing at least {minMatches} {searchValue} in {drawCount} cards
            </div>
            <div className="text-xs text-green-700">
              (probability: {result.probability.toFixed(4)})
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
