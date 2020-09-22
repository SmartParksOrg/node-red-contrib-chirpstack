import { NodeInitializer } from "node-red";
import {
  ChirpstackConnectionNode,
  ChirpstackConnectionNodeDef,
} from "./modules/types";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackConnectionNodeConstructor(
    this: ChirpstackConnectionNode,
    config: ChirpstackConnectionNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    this.host = config.host;
    this.port = config.port;
    this.username = config.username;
    this.password = config.password;
  }

  RED.nodes.registerType(
    "chirpstack-connection",
    ChirpstackConnectionNodeConstructor
  );
};

export = nodeInit;
