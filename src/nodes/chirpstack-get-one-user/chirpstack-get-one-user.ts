import { NodeInitializer } from "node-red";
import {
  ChirpstackGetOneUserNode,
  ChirpstackGetOneUserNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";

import * as grpc from "grpc";
import * as user from "@chirpstack/chirpstack-api/as/external/api/user_pb";
import { UserServiceClient } from "@chirpstack/chirpstack-api/as/external/api/user_grpc_pb";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackGetOneUserNodeConstructor(
    this: ChirpstackGetOneUserNode,
    config: ChirpstackGetOneUserNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);
    this.on("input", (msg, send, done) => {
      // const userServiceClient = new UserServiceClient(
      //     this.chirpstackConnection.fullAddress,
      //     grpc.credentials.createInsecure()
      // );
      const getUserRequest = new user.GetUserRequest();

      if (typeof msg.payload === "number") {
        getUserRequest.setId(msg.payload);
      } else if (typeof msg.payload === "string") {
        getUserRequest.setId(Number(msg.payload));
      } else {
        this.error("no valid user id");
        return;
      }

      new UserServiceClient(
        this.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).get(
        getUserRequest,
        this.chirpstackConnection.grpcMetadata,
        null,
        (error, getUserResponse) => {
          msg.payload = getUserResponse?.getUser()?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  RED.nodes.registerType(
    "chirpstack-get-one-user",
    ChirpstackGetOneUserNodeConstructor
  );
};

export = nodeInit;
