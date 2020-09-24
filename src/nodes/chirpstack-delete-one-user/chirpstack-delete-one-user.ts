import { NodeInitializer } from "node-red";
import {
  ChirpstackDeleteOneUserNode,
  ChirpstackDeleteOneUserNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";
import * as user from "@chirpstack/chirpstack-api/as/external/api/user_pb";
import { UserServiceClient } from "@chirpstack/chirpstack-api/as/external/api/user_grpc_pb";
import grpc from "grpc";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackDeleteOneUserNodeConstructor(
    this: ChirpstackDeleteOneUserNode,
    config: ChirpstackDeleteOneUserNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);

    this.on("input", (msg, send, done) => {
      const deleteUserRequest = new user.DeleteUserRequest();

      if (typeof msg.payload === "number") {
        deleteUserRequest.setId(msg.payload);
      } else if (typeof msg.payload === "string") {
        deleteUserRequest.setId(Number(msg.payload));
      } else {
        this.error("no valid user id");
        return;
      }
      new UserServiceClient(
        this.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).delete(
        deleteUserRequest,
        this.chirpstackConnection.grpcMetadata,
        null,
        (error, res) => {
          if (error) {
            this.error(error);
            msg.payload = error;
            send(msg);
            done();
            return;
          }
          msg.payload = res?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  RED.nodes.registerType(
    "chirpstack-delete-one-user",
    ChirpstackDeleteOneUserNodeConstructor
  );
};

export = nodeInit;
