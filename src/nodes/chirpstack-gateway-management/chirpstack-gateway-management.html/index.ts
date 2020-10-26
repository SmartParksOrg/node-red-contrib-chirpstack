import { EditorRED } from "node-red";
import { ChirpstackGatewayManagementEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackGatewayManagementEditorNodeProperties>(
  "chirpstack-gateway-management",
  {
    category: "chirpstack",
    color: "#2094f3",
    defaults: {
      connection: { value: "", type: "chirpstack-connection" },
      name: { value: "" },
      action: { value: "list" },
    },
    inputs: 1,
    outputs: 1,
    icon: "chirpstack.png",
    paletteLabel: "ChirpStack Gateways",
    label() {
      return this.name || "Chirpstack Gateways";
    },
  }
);
