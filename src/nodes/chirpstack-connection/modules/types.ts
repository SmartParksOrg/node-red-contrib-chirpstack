import { ChirpstackConnectionOptions } from "../shared/types";
import * as grpc from "grpc";
import { Node, NodeDef } from "node-red";

export interface ChirpstackConnectionNodeDef
  extends NodeDef,
    ChirpstackConnectionOptions {}

export interface ChirpstackConnectionNode
  extends Node,
    ChirpstackConnectionOptions {
  fullAddress: string;
  grpcMetadata: grpc.Metadata;
}

// export type ChirpstackConnectionNode = Node;
