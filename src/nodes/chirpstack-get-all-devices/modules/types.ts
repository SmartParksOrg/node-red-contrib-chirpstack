import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "../../shared/types";
import { ChirpstackGetAllDevicesOptions } from "../shared/types";

export interface ChirpstackGetAllDevicesNodeDef
  extends ChirpstackBaseNodeDef,
    ChirpstackGetAllDevicesOptions {}

// export interface ChirpstackGetAllDevicesNode extends ChirpstackBaseNode {}
export type ChirpstackGetAllDevicesNode = ChirpstackBaseNode;
