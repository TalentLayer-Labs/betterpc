import fs from "fs";
import { readArguments } from "./arguments";

export const configHelp =
  "Config structure: { port, relay, serviceId, providers, mode, counterServiceId?, counterPeerId?}\n" +
  "Where 'mode' can be: 'random' (default), 'round-robin' or 'quorum',\n" +
  "'counterServiceId' and 'counterPeerId' will use local service if undefined.\n";
("'quorumServiceId' and 'quorumPeerId' will use local service if undefined.\n");

export function readConfig(path: string) {
  const rawdata = fs.readFileSync(path);
  const config = JSON.parse(rawdata.toString());

  const errors = [];
  if (!config.port) {
    errors.push("Specify port ('port') in config");
  }
  if (!config.relay) {
    errors.push("Specify Fluence peer address ('relay') in config");
  }

  return {
    config,
    errors,
    help: configHelp,
  };
}

export function getConfig() {
  const args = readArguments(process.argv.slice(2));

  if (args.errors.length > 0) {
    console.log(args.help);
    args.errors.forEach((err) => console.log(err));
    process.exit(1);
  }

  const { config, errors, help } = readConfig(args.configPath);

  if (errors.length > 0) {
    errors.forEach((err) => console.log(err));
    console.log(help);
    process.exit(1);
  }

  return config;
}
