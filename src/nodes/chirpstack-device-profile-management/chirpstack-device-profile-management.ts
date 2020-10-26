import { NodeInitializer } from "node-red";
import {
  ChirpstackDeviceProfileManagementNode,
  ChirpstackDeviceProfileManagementNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";

import grpc from "grpc";
import {
  DeviceProfileListItem,
  ListDeviceProfileRequest,
  GetDeviceProfileRequest,
  CreateDeviceProfileRequest,
  UpdateDeviceProfileRequest,
  DeleteDeviceProfileRequest,
} from "@chirpstack/chirpstack-api/as/external/api/deviceProfile_pb";
import { DeviceProfileServiceClient } from "@chirpstack/chirpstack-api/as/external/api/deviceProfile_grpc_pb";
import { DeviceProfile } from "@chirpstack/chirpstack-api/as/external/api/profiles_pb";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackDeviceProfileManagementNodeConstructor(
    this: ChirpstackDeviceProfileManagementNode,
    config: ChirpstackDeviceProfileManagementNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.chirpstackConnection = setConnection(this, config, RED);

    switch (config.action) {
      case "list":
        listAllDeviceProfiles(this);
        break;
      case "get":
        getOneDeviceProfile(this);
        break;
      case "create":
        createOneDeviceProfile(this);
        break;
      case "update":
        updateOneDeviceProfile(this);
        break;
      case "delete":
        deleteOneDeviceProfile(this);
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

  function listAllDeviceProfiles(
    node: ChirpstackDeviceProfileManagementNode
  ): void {
    node.on("input", (msg, send, done) => {
      const listDeviceProfileRequest = new ListDeviceProfileRequest();
      listDeviceProfileRequest.setLimit(5);
      listDeviceProfileRequest.getOffset();

      const results: DeviceProfileListItem[] = [];
      const client = new DeviceProfileServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      );

      handleListAllDeviceProfilesRequest(
        0,
        10,
        results,
        client,
        node.chirpstackConnection.grpcMetadata
      ).then((deviceProfileList) => {
        const nodeRedResponse: unknown[] = [];
        deviceProfileList.forEach((item) => {
          nodeRedResponse.push(item.toObject());
        });
        msg.payload = nodeRedResponse;
        send(msg);
        done();
      });
    });
  }

  function handleListAllDeviceProfilesRequest(
    offset: number,
    limit: number,
    resultSet: DeviceProfileListItem[],
    client: DeviceProfileServiceClient,
    metaData: grpc.Metadata
  ): Promise<DeviceProfileListItem[]> {
    const request = new ListDeviceProfileRequest();
    request.setLimit(limit);
    request.setOffset(offset);
    return new Promise((resolve) => {
      client.list(request, metaData, null, (error, response) => {
        response?.getResultList().forEach((item) => {
          resultSet.push(item);
        });
        if (offset + limit < (response?.getTotalCount() || 0)) {
          return resolve(
            handleListAllDeviceProfilesRequest(
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

  function getOneDeviceProfile(
    node: ChirpstackDeviceProfileManagementNode
  ): void {
    node.on("input", (msg, send, done) => {
      const getDeviceProfileRequest = new GetDeviceProfileRequest();
      // TODO: fix
      if (typeof msg.payload === "string") {
        getDeviceProfileRequest.setId(msg.payload);
      } else {
        node.error("no valid device profile id");
        return;
      }

      new DeviceProfileServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).get(
        getDeviceProfileRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, getDeviceProfileResponse) => {
          msg.payload = getDeviceProfileResponse
            ?.getDeviceProfile()
            ?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  function createOneDeviceProfile(
    node: ChirpstackDeviceProfileManagementNode
  ): void {
    node.on("input", (msg, send, done) => {
      const createDeviceProfileRequest = new CreateDeviceProfileRequest();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newObject: any = msg.payload;
      const deviceProfile = new DeviceProfile();

      deviceProfile.setId(newObject?.id);
      deviceProfile.setName(newObject?.name);
      deviceProfile.setOrganizationId(newObject?.organizationId);
      deviceProfile.setNetworkServerId(newObject?.networkServerId);
      deviceProfile.setSupportsClassB(newObject?.supportsClassB);
      deviceProfile.setClassBTimeout(newObject?.classBTimeout);
      deviceProfile.setPingSlotPeriod(newObject?.pingSlotPeriod);
      deviceProfile.setPingSlotDr(newObject?.pingSlotDr);
      deviceProfile.setPingSlotFreq(newObject?.pingSlotFreq);
      deviceProfile.setSupportsClassC(newObject?.supportsClassC);
      deviceProfile.setClassCTimeout(newObject?.classCTimeout);
      deviceProfile.setMacVersion(newObject?.macVersion);
      deviceProfile.setRegParamsRevision(newObject?.regParamsRevision);
      deviceProfile.setRxDelay1(newObject?.rxDelay1);
      deviceProfile.setRxDrOffset1(newObject?.rxDrOffset1);
      deviceProfile.setRxDatarate2(newObject?.rxDatarate2);
      deviceProfile.setRxFreq2(newObject?.rxFreq2);
      deviceProfile.setMaxEirp(newObject?.maxEirp);
      deviceProfile.setMaxDutyCycle(newObject?.maxDutyCycle);
      deviceProfile.setSupportsJoin(newObject?.supportsJoin);
      deviceProfile.setRfRegion(newObject?.rfRegion);
      deviceProfile.setSupports32bitFCnt(newObject?.supports32bitFCnt);
      deviceProfile.setPayloadCodec(newObject?.payloadCodec);
      deviceProfile.setPayloadEncoderScript(newObject?.payloadEncoderScript);
      deviceProfile.setPayloadDecoderScript(newObject?.payloadDecoderScript);
      deviceProfile.setGeolocBufferTtl(newObject?.geolocBufferTtl);
      deviceProfile.setGeolocMinBufferSize(newObject?.geolocMinBufferSize);

      createDeviceProfileRequest.setDeviceProfile(deviceProfile);

      new DeviceProfileServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).create(
        createDeviceProfileRequest,
        node.chirpstackConnection.grpcMetadata,
        null,
        (error, createDeviceProfileResponse) => {
          if (error) {
            node.error(error);
            msg.payload = error;
            send(msg);
            done();
            return;
          }
          msg.payload = createDeviceProfileResponse?.toObject();
          send(msg);
          done();
        }
      );
    });
  }

  function updateOneDeviceProfile(
    node: ChirpstackDeviceProfileManagementNode
  ): void {
    node.on("input", (msg, send, done) => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dirtyObject: any = msg.payload;
      const dirtyDeviceProfile = new DeviceProfile();

      dirtyDeviceProfile.setId(dirtyObject?.id);
      dirtyDeviceProfile.setName(dirtyObject?.name);
      dirtyDeviceProfile.setOrganizationId(dirtyObject?.organizationId);
      dirtyDeviceProfile.setNetworkServerId(dirtyObject?.networkServerId);
      dirtyDeviceProfile.setSupportsClassB(dirtyObject?.supportsClassB);
      dirtyDeviceProfile.setClassBTimeout(dirtyObject?.classBTimeout);
      dirtyDeviceProfile.setPingSlotPeriod(dirtyObject?.pingSlotPeriod);
      dirtyDeviceProfile.setPingSlotDr(dirtyObject?.pingSlotDr);
      dirtyDeviceProfile.setPingSlotFreq(dirtyObject?.pingSlotFreq);
      dirtyDeviceProfile.setSupportsClassC(dirtyObject?.supportsClassC);
      dirtyDeviceProfile.setClassCTimeout(dirtyObject?.classCTimeout);
      dirtyDeviceProfile.setMacVersion(dirtyObject?.macVersion);
      dirtyDeviceProfile.setRegParamsRevision(dirtyObject?.regParamsRevision);
      dirtyDeviceProfile.setRxDelay1(dirtyObject?.rxDelay1);
      dirtyDeviceProfile.setRxDrOffset1(dirtyObject?.rxDrOffset1);
      dirtyDeviceProfile.setRxDatarate2(dirtyObject?.rxDatarate2);
      dirtyDeviceProfile.setRxFreq2(dirtyObject?.rxFreq2);
      dirtyDeviceProfile.setMaxEirp(dirtyObject?.maxEirp);
      dirtyDeviceProfile.setMaxDutyCycle(dirtyObject?.maxDutyCycle);
      dirtyDeviceProfile.setSupportsJoin(dirtyObject?.supportsJoin);
      dirtyDeviceProfile.setRfRegion(dirtyObject?.rfRegion);
      dirtyDeviceProfile.setSupports32bitFCnt(dirtyObject?.supports32bitFCnt);
      dirtyDeviceProfile.setPayloadCodec(dirtyObject?.payloadCodec);
      dirtyDeviceProfile.setPayloadEncoderScript(
        dirtyObject?.payloadEncoderScript
      );
      dirtyDeviceProfile.setPayloadDecoderScript(
        dirtyObject?.payloadDecoderScript
      );
      dirtyDeviceProfile.setGeolocBufferTtl(dirtyObject?.geolocBufferTtl);
      dirtyDeviceProfile.setGeolocMinBufferSize(
        dirtyObject?.geolocMinBufferSize
      );

      const updateDeviceProfileRequest = new UpdateDeviceProfileRequest();
      updateDeviceProfileRequest.setDeviceProfile(dirtyDeviceProfile);

      new DeviceProfileServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).update(
        updateDeviceProfileRequest,
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

  function deleteOneDeviceProfile(
    node: ChirpstackDeviceProfileManagementNode
  ): void {
    node.on("input", (msg, send, done) => {
      const deleteDeviceProfileRequest = new DeleteDeviceProfileRequest();

      if (typeof msg.payload === "string") {
        deleteDeviceProfileRequest.setId(msg.payload);
      } else {
        node.error("no valid device profile id");
        return;
      }
      new DeviceProfileServiceClient(
        node.chirpstackConnection.fullAddress,
        grpc.credentials.createInsecure()
      ).delete(
        deleteDeviceProfileRequest,
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
    "chirpstack-device-profile-management",
    ChirpstackDeviceProfileManagementNodeConstructor
  );
};

export = nodeInit;
