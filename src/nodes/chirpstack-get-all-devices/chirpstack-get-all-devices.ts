import { NodeInitializer } from "node-red";
import {
  ChirpstackGetAllDevicesNode,
  ChirpstackGetAllDevicesNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";
import grpc from "grpc";

import * as device from "@chirpstack/chirpstack-api/as/external/api/device_pb";
import { DeviceListItem } from "@chirpstack/chirpstack-api/as/external/api/device_pb";
import { DeviceServiceClient } from "@chirpstack/chirpstack-api/as/external/api/device_grpc_pb";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackGetAllDevicesNodeConstructor(
    this: ChirpstackGetAllDevicesNode,
    config: ChirpstackGetAllDevicesNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);

    this.on("input", (msg, send, done) => {
      const listDeviceRequest = new device.ListDeviceRequest();
      listDeviceRequest.setLimit(5);
      listDeviceRequest.getOffset();

      getDeviceList(
        5,
        this.chirpstackConnection.fullAddress,
        this.chirpstackConnection.grpcMetadata
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

  function getDeviceList(
    limit: number,
    address: string,
    metaData: grpc.Metadata
  ): Promise<DeviceListItem[]> {
    const results: DeviceListItem[] = [];
    const client = new DeviceServiceClient(
      address,
      grpc.credentials.createInsecure()
    );

    return handleRequest(0, limit, results, client, metaData).then(
      (deviceList) => {
        return deviceList;
      }
    );
  }

  function handleRequest(
    offset: number,
    limit: number,
    resultSet: DeviceListItem[],
    client: DeviceServiceClient,
    metaData: grpc.Metadata
  ): Promise<DeviceListItem[]> {
    const request = new device.ListDeviceRequest();
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
    "chirpstack-get-all-devices",
    ChirpstackGetAllDevicesNodeConstructor
  );
};

export = nodeInit;
