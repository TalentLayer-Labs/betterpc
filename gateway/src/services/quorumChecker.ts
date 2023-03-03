import { EthResult } from "types";
import { QuorumCheckerDef } from "../../aqua-compiled/rpc";

export interface CallResult {
  provider: string;
  result: EthResult;
}

// Provider url to score
const scores: Record<string, number> = {};

const getRpcsByScore = () => {
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
const updateScores = (callResults: CallResult[], mode: string) => {
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

const getFrequencies = (values: string[]) => {
  return values.reduce((counts, result) => {
    if (counts[result] === undefined) {
      counts[result] = 1;
    } else {
      counts[result] = counts[result] + 1;
    }
    return counts;
  }, {} as Record<string, any>);
};

function findSameResults(callResults: CallResult[], minNum: number) {
  const results = callResults.map((cr) => cr.result);
  const values = results.filter((obj) => obj.success).map((obj) => obj.value);

  // Count how many times each result is present
  const resultFrequencies = getFrequencies(values);

  // Find most frequent value (mode)
  const maxFrequency = Math.max(...Object.values(resultFrequencies));
  const mode = Object.entries(resultFrequencies).find(
    (entry) => entry[1] === maxFrequency,
  )?.[0];

  console.log("Result counts: ", resultFrequencies);
  console.log("Mode: ", mode, ", repeated ", maxFrequency, "times");

  if (maxFrequency >= minNum && mode) {
    // Find rpcs which returned a value equal to the mode
    const modeRpcs = callResults
      .filter((cr) => cr.result.value === mode)
      .map((cr) => cr.provider);

    console.log("Mode rpcs: ", modeRpcs);

    // Update rpcs scores (increase score by 1 for rpcs which returned most frequent value)
    updateScores(callResults, mode);
    console.log("Scores: ", scores);

    const bestRpcs = getRpcsByScore();
    console.log("Rpcs by score: ", bestRpcs);

    return {
      value: mode,
      results,
      error: "",
    };
  } else {
    return {
      error: "No consensus in results",
      results,
      value: "",
    };
  }
}

export class QuorumChecker implements QuorumCheckerDef {
  check(callResults: CallResult[], minQuorum: number) {
    console.log("Call results: ", callResults);
    return findSameResults(callResults, minQuorum);
  }

  getProvidersByScore() {
    return getRpcsByScore();
  }
}
