import {Node, NodeDef} from "node-red";
import {ChirpstackBaseOptions} from "../shared/types";
import {ChirpstackConnectionNode} from "../../chirpstack-connection/modules/types";

export interface ChirpstackBaseNodeDef extends NodeDef, ChirpstackBaseOptions {
    connection: any
}

export interface ChirpstackBaseNode extends Node {
    chirpstackConnection: ChirpstackConnectionNode
}

// export type ChirpstackBaseNode = Node;
