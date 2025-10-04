// Card types for Balatro probability calculator
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export interface Card {
  id: string;
  rank: Rank;
  suit: Suit;
}

export interface CalculationRequest {
  deck: Card[];
  drawCount: number;
  minMatches: number;
  searchType: 'rank' | 'suit' | 'color';
  searchValue: string;
}

export interface CalculationResponse {
  probability: number;
  percentage: string;
}
