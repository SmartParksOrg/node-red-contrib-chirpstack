import { NodeAPI } from "node-red";
import { ChirpstackConnectionNode } from "../chirpstack-connection/modules/types";
import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "./types";

export function setConnection(
  baseNode: ChirpstackBaseNode,
  config: ChirpstackBaseNodeDef,
  RED: NodeAPI
): ChirpstackConnectionNode {
  const chirpstackConnection = <ChirpstackConnectionNode>(
    RED.nodes.getNode(config.connection)
  );
  if (!chirpstackConnection) {
    baseNode.error("No chirpstack connection set");
    baseNode.status({
      fill: "red",
      shape: "dot",
      text: "error",
    });
    return chirpstackConnection;
  }

  if (chirpstackConnection.throwError) {
    baseNode.error("Error in chirpstack connection");
    baseNode.status({
      fill: "red",
      shape: "dot",
      text: chirpstackConnection.throwError,
    });
    return chirpstackConnection;
  }

  // all good
  baseNode.status({
    fill: "green",
    shape: "dot",
    text: "connected",
  });
  return chirpstackConnection;
}
