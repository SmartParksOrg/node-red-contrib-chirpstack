import { Node, NodeDef } from "node-red";
import { ChirpstackConnectionNode } from "../chirpstack-connection/modules/types";

export interface ChirpstackBaseNodeDef extends NodeDef {
  connection: string;
}

export interface ChirpstackEssentialsNode extends Node {
  chirpstackConnection: ChirpstackConnectionNode;
}

// export type ChirpstackBaseNode = Node;
