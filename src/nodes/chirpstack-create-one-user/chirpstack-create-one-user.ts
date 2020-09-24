import { NodeInitializer } from "node-red";
import {
  ChirpstackCreateOneUserNode,
  ChirpstackCreateOneUserNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";
import * as user from "@chirpstack/chirpstack-api/as/external/api/user_pb";
import { UserServiceClient } from "@chirpstack/chirpstack-api/as/external/api/user_grpc_pb";
import { User } from "@chirpstack/chirpstack-api/as/external/api/user_pb";
import grpc from "grpc";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackCreateOneUserNodeConstructor(
    this: ChirpstackCreateOneUserNode,
    config: ChirpstackCreateOneUserNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);

    this.on("input", (msg, send, done) => {
      const createUserRequest = new user.CreateUserRequest();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newObject: any = msg.payload;
      const newUser = new User();

      newUser.setId(newObject?.id);
      newUser.setEmail(newObject?.email);
      newUser.setIsActive(newObject?.isActive);
      newUser.setIsAdmin(newObject?.isAdmin);
      newUser.setNote(newObject?.note);
      newUser.setSessionTtl(newObject?.sessionTtl);

      createUserRequest.setUser(newUser);
      createUserRequest.setPassword(newObject?.password);

      new UserServiceClient(
        this.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).create(
        createUserRequest,
        this.chirpstackConnection.grpcMetadata,
        null,
        (error, createUserResponse) => {
          if (error) {
            this.error(error);
            msg.payload = error;
            send(msg);
            done();
            return;
          }
          msg.payload = createUserResponse?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  RED.nodes.registerType(
    "chirpstack-create-one-user",
    ChirpstackCreateOneUserNodeConstructor
  );
};

export = nodeInit;
