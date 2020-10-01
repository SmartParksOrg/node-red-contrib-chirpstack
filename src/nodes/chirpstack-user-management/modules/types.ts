import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "../../shared/types";
import { ChirpstackUserManagementOptions } from "../shared/types";

export interface ChirpstackUserManagementNodeDef
  extends ChirpstackBaseNodeDef,
    ChirpstackUserManagementOptions {}

// export interface ChirpstackUserManagementNode extends ChirpstackBaseNode {}
export type ChirpstackUserManagementNode = ChirpstackBaseNode;
