import { CounterDef } from "../../aqua-compiled/rpc";

export class Counter implements CounterDef {
  counters: Record<string, number> = {};

  incrementAndReturn(id: string): number {
    if (!this.counters[id]) {
      this.counters[id] = 0;
    }

    this.counters[id]++;
    console.log(`Counter ${id}: `, this.counters[id]);
    return this.counters[id];
  }
}
