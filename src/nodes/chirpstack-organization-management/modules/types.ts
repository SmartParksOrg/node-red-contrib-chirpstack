import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "../../shared/types";
import { ChirpstackOrganizationManagementOptions } from "../shared/types";

export interface ChirpstackOrganizationManagementNodeDef
  extends ChirpstackBaseNodeDef,
    ChirpstackOrganizationManagementOptions {}

// export interface ChirpstackOrganizationManagementNode extends ChirpstackBaseNode {}
export type ChirpstackOrganizationManagementNode = ChirpstackBaseNode;
