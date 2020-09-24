import { NodeInitializer } from "node-red";
import {
  ChirpstackUpdateOneUserNode,
  ChirpstackUpdateOneUserNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";
import * as user from "@chirpstack/chirpstack-api/as/external/api/user_pb";
import { UserServiceClient } from "@chirpstack/chirpstack-api/as/external/api/user_grpc_pb";
import grpc from "grpc";
import { User } from "@chirpstack/chirpstack-api/as/external/api/user_pb";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackUpdateOneUserNodeConstructor(
    this: ChirpstackUpdateOneUserNode,
    config: ChirpstackUpdateOneUserNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);

    this.on("input", (msg, send, done) => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dirtyObject: any = msg.payload;
      const dirtyUser = new User();

      dirtyUser.setId(dirtyObject?.id);
      dirtyUser.setEmail(dirtyObject?.email);
      dirtyUser.setIsActive(dirtyObject?.isActive);
      dirtyUser.setIsAdmin(dirtyObject?.isAdmin);
      dirtyUser.setNote(dirtyObject?.note);
      dirtyUser.setSessionTtl(dirtyObject?.sessionTtl);

      const updateUserRequest = new user.UpdateUserRequest();
      updateUserRequest.setUser(dirtyUser);

      new UserServiceClient(
        this.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).update(
        updateUserRequest,
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
    "chirpstack-update-one-user",
    ChirpstackUpdateOneUserNodeConstructor
  );
};

export = nodeInit;
