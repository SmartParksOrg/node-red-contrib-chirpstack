import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "../../shared/types";
import { ChirpstackDeleteOneUserOptions } from "../shared/types";

export interface ChirpstackDeleteOneUserNodeDef
  extends ChirpstackBaseNodeDef,
    ChirpstackDeleteOneUserOptions {}

// export interface ChirpstackDeleteOneUserNode extends ChirpstackBaseNode {}
export type ChirpstackDeleteOneUserNode = ChirpstackBaseNode;
