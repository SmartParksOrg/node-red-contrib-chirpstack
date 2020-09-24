import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "../../shared/types";
import { ChirpstackCreateOneUserOptions } from "../shared/types";

export interface ChirpstackCreateOneUserNodeDef
  extends ChirpstackBaseNodeDef,
    ChirpstackCreateOneUserOptions {}

// export interface ChirpstackCreateOneUserNode extends ChirpstackBaseNode {}
export type ChirpstackCreateOneUserNode = ChirpstackBaseNode;
