import { NodeInitializer } from "node-red";
import {
  ChirpstackApplicationManagementNode,
  ChirpstackApplicationManagementNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";
import { ChirpstackUserManagementNode } from "../chirpstack-user-management/modules/types";

import grpc from "grpc";
import {
  ApplicationListItem,
  ListApplicationRequest,
  GetApplicationRequest,
  CreateApplicationRequest,
  Application,
  UpdateApplicationRequest,
  DeleteApplicationRequest,
} from "@chirpstack/chirpstack-api/as/external/api/application_pb";
import { ApplicationServiceClient } from "@chirpstack/chirpstack-api/as/external/api/application_grpc_pb";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackApplicationManagementNodeConstructor(
    this: ChirpstackApplicationManagementNode,
    config: ChirpstackApplicationManagementNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);

    switch (config.action) {
      case "list":
        listAllApplications(this);
        break;
      case "get":
        getOneApplication(this);
        break;
      case "create":
        createOneApplication(this);
        break;
      case "update":
        updateOneApplication(this);
        break;
      case "delete":
        deleteOneApplication(this);
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

  function listAllApplications(node: ChirpstackUserManagementNode): void {
    node.on("input", (msg, send, done) => {
      const listApplicationRequest = new ListApplicationRequest();
      listApplicationRequest.setLimit(5);
      listApplicationRequest.getOffset();

      const results: ApplicationListItem[] = [];
      const client = new ApplicationServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      );

      handleListAllApplicationsRequest(
        0,
        10,
        results,
        client,
        node.chirpstackConnection.grpcMetadata
      ).then((applicationList) => {
        const nodeRedResponse: unknown[] = [];
        applicationList.forEach((item) => {
          nodeRedResponse.push(item.toObject());
        });
        msg.payload = nodeRedResponse;
        send(msg);
        done();
      });
    });
  }

  function handleListAllApplicationsRequest(
    offset: number,
    limit: number,
    resultSet: ApplicationListItem[],
    client: ApplicationServiceClient,
    metaData: grpc.Metadata
  ): Promise<ApplicationListItem[]> {
    const request = new ListApplicationRequest();
    request.setLimit(limit);
    request.setOffset(offset);
    return new Promise((resolve) => {
      client.list(request, metaData, null, (error, response) => {
        response?.getResultList().forEach((item) => {
          resultSet.push(item);
        });
        if (offset + limit < (response?.getTotalCount() || 0)) {
          return resolve(
            handleListAllApplicationsRequest(
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

  function getOneApplication(node: ChirpstackUserManagementNode): void {
    node.on("input", (msg, send, done) => {
      const getApplicationRequest = new GetApplicationRequest();
      if (typeof msg.payload === "number") {
        getApplicationRequest.setId(msg.payload);
      } else if (typeof msg.payload === "string") {
        getApplicationRequest.setId(Number(msg.payload));
      } else {
        node.error("no valid application id");
        return;
      }

      new ApplicationServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).get(
        getApplicationRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, getApplicationResponse) => {
          msg.payload = getApplicationResponse?.getApplication()?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  function createOneApplication(node: ChirpstackUserManagementNode): void {
    node.on("input", (msg, send, done) => {
      const createApplicationRequest = new CreateApplicationRequest();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newObject: any = msg.payload;
      const application = new Application();

      application.setId(newObject?.id);
      application.setDescription(newObject?.description);
      application.setName(newObject?.name);
      application.setOrganizationId(newObject?.organizationId);
      application.setPayloadCodec(newObject?.payloadCodec);
      application.setPayloadDecoderScript(newObject?.payloadDecoderScript);
      application.setPayloadEncoderScript(newObject?.payloadEncoderScript);
      application.setServiceProfileId(newObject?.serviceProfileId);

      createApplicationRequest.setApplication(application);

      new ApplicationServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).create(
        createApplicationRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, createApplicationResponse) => {
          if (error) {
            node.error(error);
            msg.payload = error;
            send(msg);
            done();
            return;
          }
          msg.payload = createApplicationResponse?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  function updateOneApplication(node: ChirpstackUserManagementNode): void {
    node.on("input", (msg, send, done) => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dirtyObject: any = msg.payload;
      const dirtyApplication = new Application();

      dirtyApplication.setId(dirtyObject?.id);
      dirtyApplication.setDescription(dirtyObject?.description);
      dirtyApplication.setName(dirtyObject?.name);
      dirtyApplication.setOrganizationId(dirtyObject?.organizationId);
      dirtyApplication.setPayloadCodec(dirtyObject?.payloadCodec);
      dirtyApplication.setPayloadDecoderScript(
        dirtyObject?.payloadDecoderScript
      );
      dirtyApplication.setPayloadEncoderScript(
        dirtyObject?.payloadEncoderScript
      );
      dirtyApplication.setServiceProfileId(dirtyObject?.serviceProfileId);

      const updateApplicationRequest = new UpdateApplicationRequest();
      updateApplicationRequest.setApplication(dirtyApplication);

      new ApplicationServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).update(
        updateApplicationRequest,
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

  function deleteOneApplication(node: ChirpstackUserManagementNode): void {
    node.on("input", (msg, send, done) => {
      const deleteApplicationRequest = new DeleteApplicationRequest();

      if (typeof msg.payload === "number") {
        deleteApplicationRequest.setId(msg.payload);
      } else if (typeof msg.payload === "string") {
        deleteApplicationRequest.setId(Number(msg.payload));
      } else {
        node.error("no valid application id");
        return;
      }
      new ApplicationServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).delete(
        deleteApplicationRequest,
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
    "chirpstack-application-management",
    ChirpstackApplicationManagementNodeConstructor
  );
};

export = nodeInit;
