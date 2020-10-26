import { NodeInitializer } from "node-red";
import {
  ChirpstackDeviceManagementNode,
  ChirpstackDeviceManagementNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";

import grpc from "grpc";
import {
  DeviceListItem,
  ListDeviceRequest,
  GetDeviceRequest,
  CreateDeviceRequest,
  Device,
  UpdateDeviceRequest,
  DeleteDeviceRequest,
} from "@chirpstack/chirpstack-api/as/external/api/device_pb";
import { DeviceServiceClient } from "@chirpstack/chirpstack-api/as/external/api/device_grpc_pb";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackDeviceManagementNodeConstructor(
    this: ChirpstackDeviceManagementNode,
    config: ChirpstackDeviceManagementNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);

    switch (config.action) {
      case "list":
        listAllDevices(this);
        break;
      case "get":
        getOneDevice(this);
        break;
      case "create":
        createOneDevice(this);
        break;
      case "update":
        updateOneDevice(this);
        break;
      case "delete":
        deleteOneDevice(this);
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

  function listAllDevices(node: ChirpstackDeviceManagementNode): void {
    node.on("input", (msg, send, done) => {
      const listDeviceRequest = new ListDeviceRequest();
      listDeviceRequest.setLimit(5);
      listDeviceRequest.getOffset();

      const results: DeviceListItem[] = [];
      const client = new DeviceServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      );

      handleListAllDevicesRequest(
        0,
        10,
        results,
        client,
        node.chirpstackConnection.grpcMetadata
      ).then((deviceList) => {
        const nodeRedResponse: unknown[] = [];
        deviceList.forEach((item) => {
          nodeRedResponse.push(item.toObject());
        });
        msg.payload = nodeRedResponse;
        send(msg);
        done();
      });
    });
  }

  function handleListAllDevicesRequest(
    offset: number,
    limit: number,
    resultSet: DeviceListItem[],
    client: DeviceServiceClient,
    metaData: grpc.Metadata
  ): Promise<DeviceListItem[]> {
    const request = new ListDeviceRequest();
    request.setLimit(limit);
    request.setOffset(offset);
    return new Promise((resolve) => {
      client.list(request, metaData, null, (error, response) => {
        response?.getResultList().forEach((item) => {
          resultSet.push(item);
        });
        if (offset + limit < (response?.getTotalCount() || 0)) {
          return resolve(
            handleListAllDevicesRequest(
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

  function getOneDevice(node: ChirpstackDeviceManagementNode): void {
    node.on("input", (msg, send, done) => {
      const getDeviceRequest = new GetDeviceRequest();

      if (typeof msg.payload === "string") {
        getDeviceRequest.setDevEui(msg.payload);
      } else {
        node.error("no valid device Eui");
        return;
      }

      new DeviceServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).get(
        getDeviceRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, getDeviceResponse) => {
          msg.payload = getDeviceResponse?.getDevice()?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  function createOneDevice(node: ChirpstackDeviceManagementNode): void {
    node.on("input", (msg, send, done) => {
      const createDeviceRequest = new CreateDeviceRequest();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newObject: any = msg.payload;
      const device = new Device();

      device.setDevEui(newObject?.devEui);
      device.setApplicationId(newObject?.applicationId);
      device.setDescription(newObject?.description);
      device.setDeviceProfileId(newObject?.deviceProfileId);
      device.setIsDisabled(newObject?.isDisabled);
      device.setName(newObject?.name);
      device.setReferenceAltitude(newObject?.referenceAltitude);
      device.setSkipFCntCheck(newObject?.skipFCntCheck);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      newObject?.tagsMap.forEach((tag: any) => {
        device.getTagsMap().set(tag[0], tag[1]);
      });
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      newObject?.variablesMap.forEach((variable: any) => {
        device.getVariablesMap().set(variable[0], variable[1]);
      });

      createDeviceRequest.setDevice(device);

      new DeviceServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).create(
        createDeviceRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, createDeviceResponse) => {
          if (error) {
            node.error(error);
            msg.payload = error;
            send(msg);
            done();
            return;
          }
          msg.payload = createDeviceResponse?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  function updateOneDevice(node: ChirpstackDeviceManagementNode): void {
    node.on("input", (msg, send, done) => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dirtyObject: any = msg.payload;
      const dirtyDevice = new Device();

      dirtyDevice.setDevEui(dirtyObject?.devEui);
      dirtyDevice.setApplicationId(dirtyObject?.applicationId);
      dirtyDevice.setDescription(dirtyObject?.description);
      dirtyDevice.setDeviceProfileId(dirtyObject?.deviceProfileId);
      dirtyDevice.setIsDisabled(dirtyObject?.isDisabled);
      dirtyDevice.setName(dirtyObject?.name);
      dirtyDevice.setReferenceAltitude(dirtyObject?.referenceAltitude);
      dirtyDevice.setSkipFCntCheck(dirtyObject?.skipFCntCheck);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      dirtyObject?.tagsMap.forEach((tag: any) => {
        dirtyDevice.getTagsMap().set(tag[0], tag[1]);
      });
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      dirtyObject?.variablesMap.forEach((variable: any) => {
        dirtyDevice.getVariablesMap().set(variable[0], variable[1]);
      });

      const updateDeviceRequest = new UpdateDeviceRequest();
      updateDeviceRequest.setDevice(dirtyDevice);

      new DeviceServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).update(
        updateDeviceRequest,
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

  function deleteOneDevice(node: ChirpstackDeviceManagementNode): void {
    node.on("input", (msg, send, done) => {
      const deleteDeviceRequest = new DeleteDeviceRequest();

      if (typeof msg.payload === "string") {
        deleteDeviceRequest.setDevEui(msg.payload);
      } else {
        node.error("no valid device Eui");
        return;
      }
      new DeviceServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).delete(
        deleteDeviceRequest,
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
    "chirpstack-device-management",
    ChirpstackDeviceManagementNodeConstructor
  );
};

export = nodeInit;
