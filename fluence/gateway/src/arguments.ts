import { configHelp } from "./config";

export function readArguments(args: string[]) {
  const configPath = args[0];

  const errors = [];

  if (!configPath) {
    errors.push("Specify config with uri to ethereum RPC providers");
  }

  return {
    configPath,
    errors,
    help: "Example: aqua-eth-gateway <config-path>\n" + configHelp,
  };
}
