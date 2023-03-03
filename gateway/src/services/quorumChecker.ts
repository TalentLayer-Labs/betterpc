import { EthResult } from "types";
import { QuorumCheckerDef } from "../../aqua-compiled/rpc";

function findSameResults(results: EthResult[], minNum: number) {
  const resultCounts = results
    .filter((obj) => obj.success)
    .map((obj) => obj.value)
    .reduce(function (i, v) {
      if (i[v] === undefined) {
        i[v] = 1;
      } else {
        i[v] = i[v] + 1;
      }
      return i;
    }, {} as Record<string, number>);

  const getMaxRepeated = Math.max(...Object.values(resultCounts));
  if (getMaxRepeated >= minNum) {
    console.log(resultCounts);
    const max = Object.entries(resultCounts).find(
      (kv) => kv[1] === getMaxRepeated,
    );
    return {
      value: max?.[0] || "",
      results: [],
      error: "",
    };
  } else {
    return {
      error: "No consensus in results",
      results: results,
      value: "",
    };
  }
}

export class QuorumChecker implements QuorumCheckerDef {
  check(ethResults: EthResult[], minQuorum: number) {
    console.log("Check quorum for:");
    console.log(ethResults);
    return findSameResults(ethResults, minQuorum);
  }
}
