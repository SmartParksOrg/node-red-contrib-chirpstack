import { NodeInitializer } from "node-red";
import {
  ChirpstackNetworkServerNode,
  ChirpstackNetworkServerNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";
import grpc from "grpc";
import { CreateMACCommandQueueItemRequest } from "@chirpstack/chirpstack-api/ns/ns_pb";
import { NetworkServerServiceClient } from "@chirpstack/chirpstack-api/ns/ns_grpc_pb";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackNetworkServerNodeConstructor(
    this: ChirpstackNetworkServerNode,
    config: ChirpstackNetworkServerNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);
    this.on("input", () => {
      this.chirpstackConnection = setConnection(this, config, RED);
    });

    switch (config.action) {
      case "createMacReq":
        createMacRequest(this);
        break;
      default:
        this.on("input", (msg, send, done) => {
          this.error("no action selected");
          msg.payload = undefined;
          send(msg);
          done();
        });
        break;
    }
  }

  function createMacRequest(node: ChirpstackNetworkServerNode): void {
    node.on("input", (msg, send, done) => {
      const createMACCommandQueueItemRequest = new CreateMACCommandQueueItemRequest();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const inputParams: any = msg.payload;

      createMACCommandQueueItemRequest.setCid(inputParams.cid); // number
      createMACCommandQueueItemRequest.setCommandsList(
        inputParams.commandsList
      ); // [string]
      createMACCommandQueueItemRequest.setDevEui(inputParams.devEui); // string
      //createMACCommandQueueItemRequest.setExtension()

      new NetworkServerServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).createMACCommandQueueItem(
        createMACCommandQueueItemRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, emptyResponse) => {
          if (error) {
            node.error(error);
            msg.payload = error;
            send(msg);
            done();
            return;
          }
          msg.payload = emptyResponse?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  RED.nodes.registerType(
    "chirpstack-network-server",
    ChirpstackNetworkServerNodeConstructor
  );
};

export = nodeInit;
