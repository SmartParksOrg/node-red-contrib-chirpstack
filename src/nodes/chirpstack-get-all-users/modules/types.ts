import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "../../shared/types";
import { ChirpstackGetAllUsersOptions } from "../shared/types";

export interface ChirpstackGetAllUsersNodeDef
  extends ChirpstackBaseNodeDef,
    ChirpstackGetAllUsersOptions {}

// export interface ChirpstackGetAllUsersNode extends ChirpstackBaseNode {}
export type ChirpstackGetAllUsersNode = ChirpstackBaseNode;
