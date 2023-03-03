import { IndexDef } from "../../aqua-compiled/rpc";

export class Index implements IndexDef {
  index = 0;

  current() {
    console.log("Getting current index: " + this.index);
    return this.index;
  }

  increment() {
    this.index++;
  }

  init() {
    this.index = 0;
  }
}
