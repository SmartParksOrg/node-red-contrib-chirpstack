import { NodeInitializer } from "node-red";
import {
  ChirpstackGatewayManagementNode,
  ChirpstackGatewayManagementNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";

import grpc from "grpc";
import {
  GatewayListItem,
  ListGatewayRequest,
  GetGatewayRequest,
  CreateGatewayRequest,
  Gateway,
  UpdateGatewayRequest,
  DeleteGatewayRequest,
} from "@chirpstack/chirpstack-api/as/external/api/gateway_pb";
import { GatewayServiceClient } from "@chirpstack/chirpstack-api/as/external/api/gateway_grpc_pb";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackGatewayManagementNodeConstructor(
    this: ChirpstackGatewayManagementNode,
    config: ChirpstackGatewayManagementNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);
    this.on("input", () => {
      this.chirpstackConnection = setConnection(this, config, RED);
    });

    switch (config.action) {
      case "list":
        listAllGateways(this);
        break;
      case "get":
        getOneGateway(this);
        break;
      case "create":
        createOneGateway(this);
        break;
      case "update":
        updateOneGateway(this);
        break;
      case "delete":
        deleteOneGateway(this);
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

  function listAllGateways(node: ChirpstackGatewayManagementNode): void {
    node.on("input", (msg, send, done) => {
      const listGatewayRequest = new ListGatewayRequest();
      listGatewayRequest.setLimit(5);
      listGatewayRequest.getOffset();

      const results: GatewayListItem[] = [];
      const client = new GatewayServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      );

      handleListAllGatewaysRequest(
        0,
        10,
        results,
        client,
        node.chirpstackConnection.grpcMetadata
      ).then((gatewayList) => {
        const nodeRedResponse: unknown[] = [];
        gatewayList.forEach((item) => {
          nodeRedResponse.push(item.toObject());
        });
        msg.payload = nodeRedResponse;
        send(msg);
        done();
      });
    });
  }

  function handleListAllGatewaysRequest(
    offset: number,
    limit: number,
    resultSet: GatewayListItem[],
    client: GatewayServiceClient,
    metaData: grpc.Metadata
  ): Promise<GatewayListItem[]> {
    const request = new ListGatewayRequest();
    request.setLimit(limit);
    request.setOffset(offset);
    return new Promise((resolve) => {
      client.list(request, metaData, null, (error, response) => {
        response?.getResultList().forEach((item) => {
          resultSet.push(item);
        });
        if (offset + limit < (response?.getTotalCount() || 0)) {
          return resolve(
            handleListAllGatewaysRequest(
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

  function getOneGateway(node: ChirpstackGatewayManagementNode): void {
    node.on("input", (msg, send, done) => {
      const getGatewayRequest = new GetGatewayRequest();

      if (typeof msg.payload === "string") {
        getGatewayRequest.setId(msg.payload);
      } else {
        node.error("no valid gateway id");
        return;
      }

      new GatewayServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).get(
        getGatewayRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, getGatewayResponse) => {
          msg.payload = getGatewayResponse?.getGateway()?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  function createOneGateway(node: ChirpstackGatewayManagementNode): void {
    node.on("input", (msg, send, done) => {
      const createGatewayRequest = new CreateGatewayRequest();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newObject: any = msg.payload;
      const gateway = new Gateway();

      gateway.setId(newObject?.id);
      gateway.setDescription(newObject?.description);
      gateway.setName(newObject?.name);
      gateway.setOrganizationId(newObject?.organizationId);
      gateway.setNetworkServerId(newObject?.networkServerId);
      gateway.setLocation(newObject?.location);

      createGatewayRequest.setGateway(gateway);

      new GatewayServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).create(
        createGatewayRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, createGatewayResponse) => {
          if (error) {
            node.error(error);
            msg.payload = error;
            send(msg);
            done();
            return;
          }
          msg.payload = createGatewayResponse?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  function updateOneGateway(node: ChirpstackGatewayManagementNode): void {
    node.on("input", (msg, send, done) => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dirtyObject: any = msg.payload;
      const dirtyGateway = new Gateway();

      dirtyGateway.setId(dirtyObject?.id);
      dirtyGateway.setDescription(dirtyObject?.description);
      dirtyGateway.setName(dirtyObject?.name);
      dirtyGateway.setOrganizationId(dirtyObject?.organizationId);
      dirtyGateway.setNetworkServerId(dirtyObject?.networkServerId);
      dirtyGateway.setLocation(dirtyObject?.location);

      const updateGatewayRequest = new UpdateGatewayRequest();
      updateGatewayRequest.setGateway(dirtyGateway);

      new GatewayServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).update(
        updateGatewayRequest,
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

  function deleteOneGateway(node: ChirpstackGatewayManagementNode): void {
    node.on("input", (msg, send, done) => {
      const deleteGatewayRequest = new DeleteGatewayRequest();

      if (typeof msg.payload === "string") {
        deleteGatewayRequest.setId(msg.payload);
      } else {
        node.error("no valid gateway id");
        return;
      }
      new GatewayServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).delete(
        deleteGatewayRequest,
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
    "chirpstack-gateway-management",
    ChirpstackGatewayManagementNodeConstructor
  );
};

export = nodeInit;
