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
 * @param isQuorumPassed whether quorum was passed
 */
export const updateScores = (
  callResults: CallResult[],
  mode: string,
  isQuorumPassed: boolean,
) => {
  for (const callResult of callResults) {
    const uri = callResult.provider;
    const isMode = callResult.result.value === mode;

    if (scores[uri] === undefined) {
      scores[uri] = 0;
    }
    const currentScore = scores[uri];

    // Decrease score if call failed
    if (!callResult.result.success) {
      scores[uri] = currentScore - 1;
    }

    // Increase score if provider returned the mode (is aligned with quorum)
    if (isMode && isQuorumPassed) {
      scores[uri] = currentScore + 1;
    }
  }

  // Increase score for fastest provider who had a successful call
  const fastestProvider = callResults.find((cr) => cr.result.success)?.provider;
  if (fastestProvider) {
    scores[fastestProvider] += 1;
  }
};

export class ScoreTracker implements ScoreTrackerDef {
  getProvidersByScore() {
    return getRpcsByScore();
  }
}
