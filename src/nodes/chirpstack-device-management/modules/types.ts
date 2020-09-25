import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "../../shared/types";
import { ChirpstackDeviceManagementOptions } from "../shared/types";

export interface ChirpstackDeviceManagementNodeDef
  extends ChirpstackBaseNodeDef,
    ChirpstackDeviceManagementOptions {}

// export interface ChirpstackDeviceManagementNode extends ChirpstackBaseNode {}
export type ChirpstackDeviceManagementNode = ChirpstackBaseNode;
