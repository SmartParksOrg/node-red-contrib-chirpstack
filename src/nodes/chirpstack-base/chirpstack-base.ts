import {NodeInitializer} from "node-red";
import {ChirpstackBaseNode, ChirpstackBaseNodeDef} from "./modules/types";
import {ChirpstackConnectionNode} from "../chirpstack-connection/modules/types";

import * as grpc from 'grpc';
import * as internalService from '@chirpstack/chirpstack-api/as/external/api/internal_grpc_pb';
import * as internalMessages from '@chirpstack/chirpstack-api/as/external/api/internal_pb';
import * as userClient from '@chirpstack/chirpstack-api/as/external/api/user_grpc_pb';
import * as user from '@chirpstack/chirpstack-api/as/external/api/user_pb';

const nodeInit: NodeInitializer = (RED): void => {
    function ChirpstackBaseNodeConstructor(
        this: ChirpstackBaseNode,
        config: ChirpstackBaseNodeDef
    ): void {
        RED.nodes.createNode(this, config);
        // Retrieve the config node
        this.chirpstackConnection = <ChirpstackConnectionNode>RED.nodes.getNode(config.connection);
        const node = this;

        if (this.chirpstackConnection) {
            node.on('input', (msg, send, done) => {
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
                    metadata.set('authorization', 'Bearer ' + response?.getJwt());
                    // This metadata can now be passed for requests to APIs that require authorization
                    // e.g.
                    const userServiceClient = new userClient.UserServiceClient(
                        node.chirpstackConnection.host + ":" + node.chirpstackConnection.port,
                        grpc.credentials.createInsecure()
                    );
                    const userRequest = new user.GetUserRequest;
                    userRequest.setId(1);
                    userServiceClient.get(userRequest, metadata, null, (error, getUserResponse) => {
                        msg.payload = getUserResponse?.getUser()?.toObject();
                        send(msg);
                        done();
                    })

                });
            });
        } else {
            node.on('input', (msg, send, done) => {
                RED.log.warn('there is no chirpstack connection')
                msg.payload = 'there is no chirpstack connection';
                send(msg);
                done();
            });
            // No config node configured
        }
    }

    RED.nodes.registerType("chirpstack-base", ChirpstackBaseNodeConstructor);
};

export = nodeInit;
