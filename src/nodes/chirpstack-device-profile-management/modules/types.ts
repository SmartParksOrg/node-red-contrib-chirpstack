import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "../../shared/types";
import { ChirpstackDeviceProfileManagementOptions } from "../shared/types";

export interface ChirpstackDeviceProfileManagementNodeDef
  extends ChirpstackBaseNodeDef,
    ChirpstackDeviceProfileManagementOptions {}

// export interface ChirpstackDeviceProfileManagementNode extends ChirpstackBaseNode {}
export type ChirpstackDeviceProfileManagementNode = ChirpstackBaseNode;
