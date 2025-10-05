// Calculate probabilities of poker hands after discarding
import type { Card } from './types';
import { detectPokerHands, ALL_POKER_HANDS, type PokerHandType } from './pokerHands';

export interface HandProbabilities {
  [handType: string]: number; // 0-1 probability
}

/**
 * Calculate the probability of each poker hand type given:
 * - Current hand
 * - Cards selected for discard
 * - Remaining deck to draw from
 */
export function calculateHandProbabilities(
  currentHand: Card[],
  selectedForDiscard: Set<string>,
  remainingDeck: Card[]
): HandProbabilities {
  const keptCards = currentHand.filter(card => !selectedForDiscard.has(card.id));
  const discardCount = selectedForDiscard.size;

  // If no discards, return current hand probabilities (0% or 100%)
  if (discardCount === 0) {
    return getCurrentHandProbabilities(currentHand);
  }

  // Calculate probabilities for each possible draw outcome
  return calculateDiscardProbabilities(keptCards, discardCount, remainingDeck);
}

/**
 * For current hand with no discards, return 100% for detected hands, 0% for others
 */
function getCurrentHandProbabilities(hand: Card[]): HandProbabilities {
  const detectedHands = detectPokerHands(hand);
  const probabilities: HandProbabilities = {};

  ALL_POKER_HANDS.forEach(handType => {
    probabilities[handType] = detectedHands.has(handType) ? 1.0 : 0.0;
  });

  return probabilities;
}

/**
 * Calculate probabilities after discarding cards and drawing replacements
 * Uses sampling approach for computational efficiency
 */
function calculateDiscardProbabilities(
  keptCards: Card[],
  drawCount: number,
  deck: Card[]
): HandProbabilities {
  // If drawing more cards than available, some outcomes impossible
  if (drawCount > deck.length) {
    return getCurrentHandProbabilities(keptCards);
  }

  const handCounts: Record<string, number> = {};
  ALL_POKER_HANDS.forEach(hand => {
    handCounts[hand] = 0;
  });

  // For small draw counts, enumerate all combinations
  // For larger draws, use Monte Carlo sampling
  const shouldEnumerate = drawCount <= 3 && deck.length <= 30;

  if (shouldEnumerate) {
    const totalCombinations = enumerateCombinations(keptCards, drawCount, deck, handCounts);

    const probabilities: HandProbabilities = {};
    ALL_POKER_HANDS.forEach(handType => {
      probabilities[handType] = handCounts[handType] / totalCombinations;
    });
    return probabilities;
  } else {
    return monteCarloSample(keptCards, drawCount, deck, 10000);
  }
}

/**
 * Enumerate all possible combinations of drawing cards
 */
function enumerateCombinations(
  keptCards: Card[],
  drawCount: number,
  deck: Card[],
  handCounts: Record<string, number>
): number {
  let totalCombinations = 0;

  function generateCombinations(start: number, drawn: Card[]) {
    if (drawn.length === drawCount) {
      totalCombinations++;
      const finalHand = [...keptCards, ...drawn];
      const detectedHands = detectPokerHands(finalHand);
      detectedHands.forEach(hand => {
        handCounts[hand]++;
      });
      return;
    }

    for (let i = start; i < deck.length; i++) {
      drawn.push(deck[i]);
      generateCombinations(i + 1, drawn);
      drawn.pop();
    }
  }

  generateCombinations(0, []);
  return totalCombinations;
}

/**
 * Monte Carlo sampling for large combination spaces
 */
function monteCarloSample(
  keptCards: Card[],
  drawCount: number,
  deck: Card[],
  sampleSize: number
): HandProbabilities {
  const handCounts: Record<string, number> = {};
  ALL_POKER_HANDS.forEach(hand => {
    handCounts[hand] = 0;
  });

  for (let sample = 0; sample < sampleSize; sample++) {
    // Randomly sample drawCount cards from deck
    const shuffled = [...deck];

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const drawn = shuffled.slice(0, drawCount);
    const finalHand = [...keptCards, ...drawn];
    const detectedHands = detectPokerHands(finalHand);

    detectedHands.forEach(hand => {
      handCounts[hand]++;
    });
  }

  const probabilities: HandProbabilities = {};
  ALL_POKER_HANDS.forEach(handType => {
    probabilities[handType] = handCounts[handType] / sampleSize;
  });

  return probabilities;
}
