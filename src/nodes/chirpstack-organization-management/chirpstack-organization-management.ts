import { NodeInitializer } from "node-red";
import {
  ChirpstackOrganizationManagementNode,
  ChirpstackOrganizationManagementNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";

import grpc from "grpc";
import {
  OrganizationListItem,
  ListOrganizationRequest,
  GetOrganizationRequest,
  CreateOrganizationRequest,
  Organization,
  UpdateOrganizationRequest,
  DeleteOrganizationRequest,
} from "@chirpstack/chirpstack-api/as/external/api/organization_pb";
import { OrganizationServiceClient } from "@chirpstack/chirpstack-api/as/external/api/organization_grpc_pb";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackOrganizationManagementNodeConstructor(
    this: ChirpstackOrganizationManagementNode,
    config: ChirpstackOrganizationManagementNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);

    switch (config.action) {
      case "list":
        listAllOrganizations(this);
        break;
      case "get":
        getOneOrganization(this);
        break;
      case "create":
        createOneOrganization(this);
        break;
      case "update":
        updateOneOrganization(this);
        break;
      case "delete":
        deleteOneOrganization(this);
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

  function listAllOrganizations(
    node: ChirpstackOrganizationManagementNode
  ): void {
    node.on("input", (msg, send, done) => {
      const listOrganizationRequest = new ListOrganizationRequest();
      listOrganizationRequest.setLimit(5);
      listOrganizationRequest.getOffset();

      const results: OrganizationListItem[] = [];
      const client = new OrganizationServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      );

      handleListAllOrganizationsRequest(
        0,
        10,
        results,
        client,
        node.chirpstackConnection.grpcMetadata
      ).then((organizationList) => {
        const nodeRedResponse: unknown[] = [];
        organizationList.forEach((item) => {
          nodeRedResponse.push(item.toObject());
        });
        msg.payload = nodeRedResponse;
        send(msg);
        done();
      });
    });
  }

  function handleListAllOrganizationsRequest(
    offset: number,
    limit: number,
    resultSet: OrganizationListItem[],
    client: OrganizationServiceClient,
    metaData: grpc.Metadata
  ): Promise<OrganizationListItem[]> {
    const request = new ListOrganizationRequest();
    request.setLimit(limit);
    request.setOffset(offset);
    return new Promise((resolve) => {
      client.list(request, metaData, null, (error, response) => {
        response?.getResultList().forEach((item) => {
          resultSet.push(item);
        });
        if (offset + limit < (response?.getTotalCount() || 0)) {
          return resolve(
            handleListAllOrganizationsRequest(
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

  function getOneOrganization(
    node: ChirpstackOrganizationManagementNode
  ): void {
    node.on("input", (msg, send, done) => {
      const getOrganizationRequest = new GetOrganizationRequest();

      if (typeof msg.payload === "number") {
        getOrganizationRequest.setId(msg.payload);
      } else if (typeof msg.payload === "string") {
        getOrganizationRequest.setId(Number(msg.payload));
      } else {
        node.error("no valid organization id");
        return;
      }

      new OrganizationServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).get(
        getOrganizationRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, getOrganizationResponse) => {
          msg.payload = getOrganizationResponse?.getOrganization()?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  function createOneOrganization(
    node: ChirpstackOrganizationManagementNode
  ): void {
    node.on("input", (msg, send, done) => {
      const createOrganizationRequest = new CreateOrganizationRequest();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newObject: any = msg.payload;
      const organization = new Organization();

      organization.setId(newObject?.id);
      organization.setName(newObject?.name);
      organization.setDisplayName(newObject?.displayName);
      organization.setCanHaveGateways(newObject?.canHaveGateways || true);
      organization.setMaxDeviceCount(newObject?.maxDeviceCount || 0);
      organization.setMaxGatewayCount(newObject?.maxGatewayCount || 0);

      createOrganizationRequest.setOrganization(organization);

      new OrganizationServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).create(
        createOrganizationRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, createOrganizationResponse) => {
          if (error) {
            node.error(error);
            msg.payload = error;
            send(msg);
            done();
            return;
          }
          msg.payload = createOrganizationResponse?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  function updateOneOrganization(
    node: ChirpstackOrganizationManagementNode
  ): void {
    node.on("input", (msg, send, done) => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dirtyObject: any = msg.payload;
      const dirtyOrganization = new Organization();

      dirtyOrganization.setId(dirtyObject?.id);
      dirtyOrganization.setName(dirtyObject?.name);
      dirtyOrganization.setDisplayName(dirtyObject?.displayName);
      dirtyOrganization.setCanHaveGateways(
        dirtyObject?.canHaveGateways || true
      );
      dirtyOrganization.setMaxDeviceCount(dirtyObject?.maxDeviceCount || 0);
      dirtyOrganization.setMaxGatewayCount(dirtyObject?.maxGatewayCount || 0);

      const updateOrganizationRequest = new UpdateOrganizationRequest();
      updateOrganizationRequest.setOrganization(dirtyOrganization);

      new OrganizationServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).update(
        updateOrganizationRequest,
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

  function deleteOneOrganization(
    node: ChirpstackOrganizationManagementNode
  ): void {
    node.on("input", (msg, send, done) => {
      const deleteOrganizationRequest = new DeleteOrganizationRequest();

      if (typeof msg.payload === "number") {
        deleteOrganizationRequest.setId(msg.payload);
      } else if (typeof msg.payload === "string") {
        deleteOrganizationRequest.setId(Number(msg.payload));
      } else {
        node.error("no valid organization id");
        return;
      }
      new OrganizationServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).delete(
        deleteOrganizationRequest,
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
    "chirpstack-organization-management",
    ChirpstackOrganizationManagementNodeConstructor
  );
};

export = nodeInit;
