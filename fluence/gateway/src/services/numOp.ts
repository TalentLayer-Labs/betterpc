import { NumOpDef } from "../../aqua-compiled/rpc";

export class NumOp implements NumOpDef {
  identity(x: number) {
    return x;
  }

  add(x: number, y: number) {
    return x + y;
  }
}
