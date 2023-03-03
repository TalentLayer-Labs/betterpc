import { CallResult } from "../types";
import { ScoreTrackerDef } from "../../aqua-compiled/rpc";

// Provider url to score
export const scores: Record<string, number> = {};

export const getRpcsByScore = () => {
  return Object.entries(scores)
    .sort((entry1, entry2) => (entry1[1] <= entry2[1] ? 1 : -1))
    .map((entry) => entry[0]);
};

/**
 * Updates the scores of the providers based on:
 *  - which providers returned the most frequent value (+1 point)
 *  - fastest provider (+1 point)
 * @param callResults results of provider calls ordered by fastest to slowest response
 * @param mode mode of call results
 */
export const updateScores = (callResults: CallResult[], mode: string) => {
  for (const [index, callResult] of callResults.entries()) {
    const uri = callResult.provider;
    const isMode = callResult.result.value === mode;

    const currentScore = scores[uri];

    if (currentScore === undefined && !isMode) {
      scores[uri] = 0;
    }

    if (isMode) {
      scores[uri] = (currentScore || 0) + 1;
    }

    // Update score for fastest provider
    if (index === 0) {
      scores[uri] += 1;
    }
  }
};

export class ScoreTracker implements ScoreTrackerDef {
  getProvidersByScore() {
    return getRpcsByScore();
  }
}
