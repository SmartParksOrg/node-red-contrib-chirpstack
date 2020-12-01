import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "../../shared/types";
import { ChirpstackNetworkServerOptions } from "../shared/types";

export interface ChirpstackNetworkServerNodeDef
  extends ChirpstackBaseNodeDef,
    ChirpstackNetworkServerOptions {}

// export interface ChirpstackNetworkServerNode extends ChirpstackBaseNode {}
export type ChirpstackNetworkServerNode = ChirpstackBaseNode;
