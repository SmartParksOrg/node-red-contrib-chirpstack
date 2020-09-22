import { NodeInitializer } from "node-red";
import {
  ChirpstackGetAllUsersNode,
  ChirpstackGetAllUsersNodeDef,
} from "./modules/types";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackGetAllUsersNodeConstructor(
    this: ChirpstackGetAllUsersNode,
    config: ChirpstackGetAllUsersNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    this.on("input", (msg, send, done) => {
      send(msg);
      done();
    });
  }

  RED.nodes.registerType(
    "chirpstack-get-all-users",
    ChirpstackGetAllUsersNodeConstructor
  );
};

export = nodeInit;
