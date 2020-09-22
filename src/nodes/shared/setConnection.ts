import { NodeAPI } from "node-red";
import { ChirpstackConnectionNode } from "../chirpstack-connection/modules/types";
import { ChirpstackBaseNode, ChirpstackBaseNodeDef } from "./types";

export function setConnection(
  //TODO: base node needs to be removed, than the essentials node can be refactored to base node
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
  // TODO: validate connection status (do a request, validate if it came trough, if yes connected, if no disconnected)
  baseNode.status({
    fill: "green",
    shape: "dot",
    text: "connected",
  });
  return chirpstackConnection;
}
