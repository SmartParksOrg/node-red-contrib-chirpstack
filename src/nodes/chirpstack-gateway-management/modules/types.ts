import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "../../shared/types";
import { ChirpstackGatewayManagementOptions } from "../shared/types";

export interface ChirpstackGatewayManagementNodeDef
  extends ChirpstackBaseNodeDef,
    ChirpstackGatewayManagementOptions {}

// export interface ChirpstackGatewayManagementNode extends ChirpstackBaseNode {}
export type ChirpstackGatewayManagementNode = ChirpstackBaseNode;
