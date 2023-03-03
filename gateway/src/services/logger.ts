import { LoggerDef } from "../../aqua-compiled/rpc";

export class Logger implements LoggerDef {
  log(s: string[]): void {
    console.log("log: " + s);
  }
  logCall(s: string): void {
    console.log("Call will be to : " + s);
  }
  logWorker(s: any): void {
    console.log("Worker used: " + JSON.stringify(s.metadata.peer_id));
  }
  logNum(s: number): void {
    console.log("Number: " + s);
  }
}
