import { CallResult } from "../types";
import { ScoreTrackerDef } from "../../aqua-compiled/rpc";

// Provider url to score
const scores: Record<string, number> = {};

export const getScores = () => {
  return scores;
};

export class ScoreTracker implements ScoreTrackerDef {
  getProvidersByScore() {
    return Object.entries(scores)
      .sort((entry1, entry2) => (entry1[1] <= entry2[1] ? 1 : -1))
      .map((entry) => entry[0]);
  }

  /**
   * Updates the scores of the providers based on:
   *  - coherence with quorum (+1 point)
   *  - fastest provider (+1 point)
   *  - failed call (-1 point), except if all calls failed (which would probably mean the request was invalid)
   * @param callResults results of provider calls ordered by fastest to slowest response
   * @param mode mode of call results
   * @param isQuorumPassed whether quorum was passed
   */
  updateScores(
    callResults: CallResult[],
    mode: string,
    isQuorumPassed: boolean,
  ) {
    const allCallsFailed = callResults.every((cr) => !cr.result.success);

    for (const callResult of callResults) {
      const uri = callResult.provider;
      const isMode = callResult.result.value === mode;

      // Initialize score if it hasn't been initialized yet
      if (scores[uri] === undefined) {
        scores[uri] = 0;
      }
      const currentScore = scores[uri];

      // Decrease score if call failed
      if (!callResult.result.success && !allCallsFailed) {
        scores[uri] = currentScore - 1;
      }

      // Increase score if provider is aligned with quorum
      if (isMode && isQuorumPassed) {
        scores[uri] = currentScore + 1;
      }
    }

    // Increase score for the fastest provider who had a successful call
    const fastestProvider = callResults.find(
      (cr) => cr.result.success,
    )?.provider;

    if (fastestProvider) {
      scores[fastestProvider] += 1;
    }
  }
}
