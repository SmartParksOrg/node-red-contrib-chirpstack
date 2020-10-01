import { NodeInitializer } from "node-red";
import {
  ChirpstackUserManagementNode,
  ChirpstackUserManagementNodeDef,
} from "./modules/types";
import grpc from "grpc";
import { setConnection } from "../shared/setConnection";

import { UserServiceClient } from "@chirpstack/chirpstack-api/as/external/api/user_grpc_pb";
import {
  CreateUserRequest,
  DeleteUserRequest,
  GetUserRequest,
  ListUserRequest,
  UpdateUserRequest,
  User,
  UserListItem,
} from "@chirpstack/chirpstack-api/as/external/api/user_pb";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackUserManagementNodeConstructor(
    this: ChirpstackUserManagementNode,
    config: ChirpstackUserManagementNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);
    switch (config.action) {
      case "list":
        listAllUsers(this);
        break;
      case "get":
        getOneUser(this);
        break;
      case "create":
        createOneUser(this);
        break;
      case "update":
        updateOneUser(this);
        break;
      case "delete":
        deleteOneUser(this);
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

  function listAllUsers(node: ChirpstackUserManagementNode): void {
    node.on("input", (msg, send, done) => {
      const listUserRequest = new ListUserRequest();
      listUserRequest.setLimit(5);
      listUserRequest.getOffset();

      const results: UserListItem[] = [];
      const client = new UserServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      );

      handleListAllUsersRequest(
        0,
        10,
        results,
        client,
        node.chirpstackConnection.grpcMetadata
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

  function handleListAllUsersRequest(
    offset: number,
    limit: number,
    resultSet: UserListItem[],
    client: UserServiceClient,
    metaData: grpc.Metadata
  ): Promise<UserListItem[]> {
    const request = new ListUserRequest();
    request.setLimit(limit);
    request.setOffset(offset);
    return new Promise((resolve) => {
      client.list(request, metaData, null, (error, response) => {
        response?.getResultList().forEach((item) => {
          resultSet.push(item);
        });
        if (offset + limit < (response?.getTotalCount() || 0)) {
          return resolve(
            handleListAllUsersRequest(
              offset + limit,
              limit,
              resultSet,
              client,
              metaData
            )
          );
        }
        return resolve(resultSet);
      });
    });
  }

  function getOneUser(node: ChirpstackUserManagementNode): void {
    node.on("input", (msg, send, done) => {
      const getUserRequest = new GetUserRequest();

      if (typeof msg.payload === "number") {
        getUserRequest.setId(msg.payload);
      } else if (typeof msg.payload === "string") {
        getUserRequest.setId(Number(msg.payload));
      } else {
        node.error("no valid user id");
        return;
      }

      new UserServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).get(
        getUserRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, getUserResponse) => {
          msg.payload = getUserResponse?.getUser()?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  function createOneUser(node: ChirpstackUserManagementNode): void {
    node.on("input", (msg, send, done) => {
      const createUserRequest = new CreateUserRequest();
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
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).create(
        createUserRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, createUserResponse) => {
          if (error) {
            node.error(error);
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

  function updateOneUser(node: ChirpstackUserManagementNode): void {
    node.on("input", (msg, send, done) => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dirtyObject: any = msg.payload;
      const dirtyUser = new User();

      dirtyUser.setId(dirtyObject?.id);
      dirtyUser.setEmail(dirtyObject?.email);
      dirtyUser.setIsActive(dirtyObject?.isActive);
      dirtyUser.setIsAdmin(dirtyObject?.isAdmin);
      dirtyUser.setNote(dirtyObject?.note);
      dirtyUser.setSessionTtl(dirtyObject?.sessionTtl);

      const updateUserRequest = new UpdateUserRequest();
      updateUserRequest.setUser(dirtyUser);

      new UserServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).update(
        updateUserRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, res) => {
          if (error) {
            node.error(error);
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

  function deleteOneUser(node: ChirpstackUserManagementNode): void {
    node.on("input", (msg, send, done) => {
      const deleteUserRequest = new DeleteUserRequest();

      if (typeof msg.payload === "number") {
        deleteUserRequest.setId(msg.payload);
      } else if (typeof msg.payload === "string") {
        deleteUserRequest.setId(Number(msg.payload));
      } else {
        node.error("no valid user id");
        return;
      }
      new UserServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).delete(
        deleteUserRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, res) => {
          if (error) {
            node.error(error);
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
    "chirpstack-user-management",
    ChirpstackUserManagementNodeConstructor
  );
};

export = nodeInit;
