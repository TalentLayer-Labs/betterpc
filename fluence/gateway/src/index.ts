#!/usr/bin/env node

"use strict";

import express from "express";
import bodyParser from "body-parser";
import { JSONRPCServer } from "json-rpc-2.0";
import { Fluence } from "@fluencelabs/fluence";
// import { Fluence } from "@fluencelabs/js-client.api";
// import "@fluencelabs/js-client.node";
import {
  optimizedEth,
  quorumEth,
  randomLoadBalancingEth,
  registerCounter,
  registerIndexCounter,
  registerLogger,
  registerQuorumChecker,
  registerScoreTracker,
  roundRobinEth,
  registerNumOp,
} from "../aqua-compiled/rpc";
import { getConfig } from "./config";
import { methods } from "./methods";
import { Logger } from "./services/logger";
import { Counter } from "./services/counter";
import { QuorumChecker } from "./services/quorumChecker";
import { getScores, ScoreTracker } from "./services/scoreTracker";
import { IndexCounter } from "./services/indexCounter";
import { NumOp } from "./services/numOp";

const config = getConfig();

let counterServiceId: string;
let counterPeerId: string;
let quorumServiceId: string;
let quorumPeerId: string;
let quorumNumber: number;
let scoreTrackerServiceId: string;
let scoreTrackerPeerId: string;
let indexCounterServiceId: string;
let indexCounterPeerId: string;
let peerId: string;

console.log("Running server...");

const route = "/";

const server = new JSONRPCServer();

async function methodHandler(reqRaw: any, method: string) {
  const req = reqRaw.map((s: any) => JSON.stringify(s));
  let result: any;

  console.log(`Receiving request '${method}'`);

  if (!config.mode || config.mode === "random") {
    result = await randomLoadBalancingEth(config.providers, method, req);
  } else if (config.mode === "round-robin") {
    console.log("peerId: " + peerId);
    result = await roundRobinEth(
      config.providers,
      method,
      req,
      counterServiceId,
      counterPeerId,
      config.serviceId,
    );
  } else if (config.mode === "quorum") {
    result = await quorumEth(
      config.providers,
      quorumNumber,
      10000,
      method,
      req,
      quorumServiceId,
      quorumPeerId,
      scoreTrackerServiceId,
      scoreTrackerPeerId,
      indexCounterServiceId,
      indexCounterPeerId,
      counterServiceId,
      counterPeerId,
      { ttl: 20000 },
    );

    const scores = await getScores();
    console.log("Provider scores: ", scores);

    // const res = await optimizedEth(
    //   method,
    //   req,
    //   scoreTrackerServiceId,
    //   scoreTrackerPeerId,
    // );
    // console.log("Optimized result: " + res?.value);

    if (!result.didPass) {
      return {
        error: "No consensus in result",
        results: result.results,
        value: result.value,
      };
    }
  } else if (config.mode === "optimized") {
    result = await optimizedEth(
      method,
      req,
      scoreTrackerServiceId,
      scoreTrackerPeerId,
    );
  }

  return JSON.parse(result.value);
}

function addMethod(op: string) {
  server.addMethod(op, async (req) => methodHandler(req, op));
}

// register all eth methods
methods.forEach((m) => {
  addMethod(m);
});

const main = async () => {
  // Initialize Fluence client
  await Fluence.start({ connectTo: config.relay });
  const peerId = Fluence.getStatus().peerId;

  // Register services
  registerLogger(new Logger());
  registerNumOp(new NumOp());
  registerCounter(new Counter());
  registerQuorumChecker(new QuorumChecker());
  registerScoreTracker(new ScoreTracker());
  registerIndexCounter(new IndexCounter());

  counterServiceId = config.counterServiceId || "counter";
  counterPeerId = config.counterPeerId || peerId;
  quorumServiceId = config.quorumServiceId || "quorum";
  quorumPeerId = config.quorumPeerId || peerId;
  quorumNumber = config.quorumNumber || 2;
  scoreTrackerServiceId = config.scoreTrackerServiceId || "scoreTracker";
  scoreTrackerPeerId = config.scoreTrackerPeerId || peerId;
  indexCounterServiceId = config.indexCounterServiceId || "indexCounter";
  indexCounterPeerId = config.indexCounterPeerId || peerId;

  const app = express();
  app.use(bodyParser.json());

  // register JSON-RPC handler
  app.post(route, (req, res) => {
    const jsonRPCRequest = req.body;
    server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
      if (jsonRPCResponse) {
        res.json(jsonRPCResponse);
      } else {
        res.sendStatus(204);
      }
    });
  });

  app.listen(config.port);

  console.log("Server was started on port " + config.port);
};

main().catch((error) => {
  console.error(error);
});
