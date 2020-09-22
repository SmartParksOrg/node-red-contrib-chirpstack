import { ChirpstackGetOneUserOptions } from "../shared/types";
import {
  ChirpstackBaseNode,
  ChirpstackBaseNodeDef,
} from "../../shared/types";

export interface ChirpstackGetOneUserNodeDef
  extends ChirpstackBaseNodeDef,
    ChirpstackGetOneUserOptions {}

// export interface ChirpstackGetOneUserNode extends ChirpstackEssentialsNode {}
export type ChirpstackGetOneUserNode = ChirpstackBaseNode;
