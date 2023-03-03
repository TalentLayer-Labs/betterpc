import { CallResult } from "../types";
import { QuorumCheckerDef } from "../../aqua-compiled/rpc";
import { getScores, updateScores } from "./scores";

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
  const mode =
    Object.entries(resultFrequencies).find(
      (entry) => entry[1] === maxFrequency,
    )?.[0] || "";

  const isQuorumPassed = maxFrequency >= minNum;

  console.log("Mode: ", mode, ", repeated ", maxFrequency, "times");

  updateScores(callResults, mode, isQuorumPassed);
  console.log("Scores: ", getScores());

  if (isQuorumPassed) {
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
}
