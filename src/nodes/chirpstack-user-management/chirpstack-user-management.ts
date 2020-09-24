import { NodeInitializer } from "node-red";
import {
  ChirpstackUserManagementNode,
  ChirpstackUserManagementNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackUserManagementNodeConstructor(
    this: ChirpstackUserManagementNode,
    config: ChirpstackUserManagementNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);

    this.on("input", (msg, send, done) => {
      send(msg);
      done();
    });
  }

  RED.nodes.registerType(
    "chirpstack-user-management",
    ChirpstackUserManagementNodeConstructor
  );
};

export = nodeInit;
