import { Node, NodeDef } from "node-red";
import { ChirpstackGetAllUsersOptions } from "../shared/types";

export interface ChirpstackGetAllUsersNodeDef
  extends NodeDef,
    ChirpstackGetAllUsersOptions {}

// export interface ChirpstackGetAllUsersNode extends Node {}
export type ChirpstackGetAllUsersNode = Node;
