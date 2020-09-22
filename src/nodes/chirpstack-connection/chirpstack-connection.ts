import { NodeInitializer } from "node-red";
import {
  ChirpstackConnectionNode,
  ChirpstackConnectionNodeDef,
} from "./modules/types";
import * as internalService from "@chirpstack/chirpstack-api/as/external/api/internal_grpc_pb";
import * as internalMessages from "@chirpstack/chirpstack-api/as/external/api/internal_pb";
import * as grpc from "grpc";

const nodeInit: NodeInitializer = (RED): void => {
  function ChirpstackConnectionNodeConstructor(
    this: ChirpstackConnectionNode,
    config: ChirpstackConnectionNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    this.host = config.host;
    this.port = config.port;
    this.username = config.username;
    this.password = config.password;

    if (!this.host || !this.port || !this.username || !this.password) {
      this.error("No Host, Port, Username or Password set");
      return;
    }

    this.fullAddress = this.host + ":" + this.port;

    // Create the client for the 'internal' service
    const internalServiceClient = new internalService.InternalServiceClient(
      this.host + ":" + this.port,
      grpc.credentials.createInsecure()
    );

    // Create and build the login request message
    const loginRequest = new internalMessages.LoginRequest();
    loginRequest.setEmail(this.username);
    loginRequest.setPassword(this.password);
    // Send the login request
    internalServiceClient.login(loginRequest, (error, response) => {
      // Build a gRPC metadata object, setting the authorization key to the JWT we
      // got back from logging in.
      if (error) {
        this.error(
          "Error on connection for Chirpstack application " +
            this.host +
            ": " +
            error
        );
        throw error;
      }
      if (!response) {
        this.error("Received empty response from Chirpstack");
        throw new Error("emptyResponse");
      }
      this.grpcMetadata = new grpc.Metadata();
      this.grpcMetadata.set("authorization", "Bearer " + response.getJwt());
    });
  }

  RED.nodes.registerType(
    "chirpstack-connection",
    ChirpstackConnectionNodeConstructor
  );
};

export = nodeInit;
