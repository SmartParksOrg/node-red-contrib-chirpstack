import { Node, NodeDef } from "node-red";
import { ChirpstackConnectionOptions } from "../shared/types";

export interface ChirpstackConnectionNodeDef extends NodeDef, ChirpstackConnectionOptions {}

export interface ChirpstackConnectionNode extends Node, ChirpstackConnectionOptions {
}
// export type ChirpstackConnectionNode = Node;
