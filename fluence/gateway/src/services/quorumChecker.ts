import { CallResult } from "../types";
import { QuorumCheckerDef, QuorumResult } from "../../aqua-compiled/rpc";

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

export class QuorumChecker implements QuorumCheckerDef {
  check(callResults: CallResult[], minNum: number): QuorumResult {
    console.log("Call results: ", callResults);

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

    const isPassed = maxFrequency >= minNum;

    console.log("Mode: ", mode, ", repeated ", maxFrequency, "times");

    return {
      isPassed,
      value: mode,
      results,
    };
  }
}
