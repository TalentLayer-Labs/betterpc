import { IndexCounterDef } from "../../aqua-compiled/rpc";

export class IndexCounter implements IndexCounterDef {
  index = 0;

  getCurrentAndIncrement() {
    // console.log("Getting current index: " + this.index);
    return this.index++;
  }

  init() {
    this.index = 0;
  }
}
