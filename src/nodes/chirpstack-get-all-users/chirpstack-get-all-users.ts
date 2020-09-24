import { NodeInitializer } from "node-red";
import {
  ChirpstackGetAllUsersNode,
  ChirpstackGetAllUsersNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";
import * as user from "@chirpstack/chirpstack-api/as/external/api/user_pb";
import { UserListItem } from "@chirpstack/chirpstack-api/as/external/api/user_pb";
import { UserServiceClient } from "@chirpstack/chirpstack-api/as/external/api/user_grpc_pb";
import grpc from "grpc";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackGetAllUsersNodeConstructor(
    this: ChirpstackGetAllUsersNode,
    config: ChirpstackGetAllUsersNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);

    this.on("input", (msg, send, done) => {
      const listUserRequest = new user.ListUserRequest();
      listUserRequest.setLimit(5);
      listUserRequest.getOffset();

      getUserList(
        5,
        this.chirpstackConnection.fullAddress,
        this.chirpstackConnection.grpcMetadata
      ).then((userList) => {
        const nodeRedResponse: unknown[] = [];
        userList.forEach((item) => {
          nodeRedResponse.push(item.toObject());
        });
        msg.payload = nodeRedResponse;
        send(msg);
        done();
      });
    });
  }

  function getUserList(
    limit: number,
    address: string,
    metaData: grpc.Metadata
  ): Promise<UserListItem[]> {
    const results: UserListItem[] = [];
    const client = new UserServiceClient(
      address,
      grpc.credentials.createInsecure()
    );

    return handleRequest(0, limit, results, client, metaData).then(
      (userList) => {
        return userList;
      }
    );
  }

  function handleRequest(
    offset: number,
    limit: number,
    resultSet: UserListItem[],
    client: UserServiceClient,
    metaData: grpc.Metadata
  ): Promise<UserListItem[]> {
    const request = new user.ListUserRequest();
    request.setLimit(limit);
    request.setOffset(offset);
    return new Promise((resolve) => {
      client.list(request, metaData, null, (error, response) => {
        response?.getResultList().forEach((item) => {
          resultSet.push(item);
        });
        if (offset + limit < (response?.getTotalCount() || 0)) {
          return resolve(
            handleRequest(offset + limit, limit, resultSet, client, metaData)
          );
        }
        return resolve(resultSet);
      });
    });
  }

  RED.nodes.registerType(
    "chirpstack-get-all-users",
    ChirpstackGetAllUsersNodeConstructor
  );
};

export = nodeInit;
