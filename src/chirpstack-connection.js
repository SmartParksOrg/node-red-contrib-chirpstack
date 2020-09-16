module.exports = function(RED) {
  'use strict';
    function ChirpstackConnectionNode(n) {
        RED.nodes.createNode(this,n);
        this.host = n.host;
        this.port = n.port;
        this.username = n.username;
        this.password = n.password;
        // this.jwtToken = n.jwtToken;
    }
    RED.nodes.registerType("chirpstack-connection",ChirpstackConnectionNode);
}
