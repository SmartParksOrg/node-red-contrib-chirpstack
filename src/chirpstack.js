module.exports = function (RED) {
  'use strict';


  function MyNode(config) {

    const grpc = require('grpc');
    const internalService = require('@chirpstack/chirpstack-api/as/external/api/internal_grpc_pb');
    const internalMessages = require('@chirpstack/chirpstack-api/as/external/api/internal_pb');
    const userService = require('@chirpstack/chirpstack-api/as/external/api/user_grpc_pb');
    const user = require('@chirpstack/chirpstack-api/as/external/api/user_pb');
    //   import * as grpc from 'grpc';
    //
    // import * as internalService from '@chirpstack/chirpstack-api/as/external/api/internal_grpc_pb';
    // import * as internalMessages from '@chirpstack/chirpstack-api/as/external/api/internal_pb';
    // import * as userClient from '@chirpstack/chirpstack-api/as/external/api/user_grpc_pb';
    //
    // import * as chirpstackApi from '@chirpstack/chirpstack-api';


    RED.nodes.createNode(this, config);

    // Retrieve the config node
    this.chirpstackConnection = RED.nodes.getNode(config.connection);
    const node = this;

    if (this.chirpstackConnection) {
      node.on('input', function (msg) {

        // Create the client for the 'internal' service
        const internalServiceClient = new internalService.InternalServiceClient(
          node.chirpstackConnection.host + ":" + node.chirpstackConnection.port,
          grpc.credentials.createInsecure()
        );

        // Create and build the login request message
        const loginRequest = new internalMessages.LoginRequest();
        loginRequest.setEmail(node.chirpstackConnection.username);
        loginRequest.setPassword(node.chirpstackConnection.password);
        // internalServiceClient.getDevicesSummary(loginRequest, (serviceError, value) => {
        //    msg.payload = value;
        //    node.send(msg);
        // });
        // internalServiceClient.listAPIKeys()
        // Send the login request
        internalServiceClient.login(loginRequest, (error, response) => {
          // Build a gRPC metadata object, setting the authorization key to the JWT we
          // got back from logging in.
          const metadata = new grpc.Metadata();
          metadata.set('authorization', 'Bearer ' + response.getJwt());
          // This metadata can now be passed for requests to APIs that require authorization
          // e.g.
          const userServiceClient = new userService.UserServiceClient(
            node.chirpstackConnection.host + ":" + node.chirpstackConnection.port,
            grpc.credentials.createInsecure()
          );
          let i = new user.GetUserRequest;
          i.setId(1);

          userServiceClient.get(i, metadata, null, (error, getUserResponse) => {
            msg.payload = getUserResponse.getUser().toObject();
            node.send(msg);
          })

        });
      });
      // Do something with:
      //  this.server.host
      //  this.server.port
    } else {
      node.on('input', function (msg) {
        msg.payload = 'there is no chirpstack connection';
        node.send(msg);
      });
      // No config node configured
    }
  }

  RED.nodes.registerType("chirpstack-base", MyNode);
}
