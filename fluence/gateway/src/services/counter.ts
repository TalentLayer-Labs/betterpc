import { CounterDef } from "../../aqua-compiled/rpc";

let counter = 0;

export class Counter implements CounterDef {
  incrementAndReturn(): number {
    counter++;
    console.log("Counter: " + counter);
    return counter;
  }
}
