import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "../../shared/types";
import { ChirpstackUpdateOneUserOptions } from "../shared/types";

export interface ChirpstackUpdateOneUserNodeDef
  extends ChirpstackBaseNodeDef,
    ChirpstackUpdateOneUserOptions {}

// export interface ChirpstackUpdateOneUserNode extends ChirpstackBaseNode {}
export type ChirpstackUpdateOneUserNode = ChirpstackBaseNode;
