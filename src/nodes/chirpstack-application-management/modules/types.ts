import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "../../shared/types";
import { ChirpstackApplicationManagementOptions } from "../shared/types";

export interface ChirpstackApplicationManagementNodeDef
  extends ChirpstackBaseNodeDef,
    ChirpstackApplicationManagementOptions {}

// export interface ChirpstackApplicationManagementNode extends ChirpstackBaseNode {}
export type ChirpstackApplicationManagementNode = ChirpstackBaseNode;
