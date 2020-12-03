import { EditorRED } from "node-red";
import { ChirpstackNetworkServerEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackNetworkServerEditorNodeProperties>(
  "chirpstack-network-server",
  {
    category: "chirpstack",
    color: "#2094f3",
    defaults: {
      connection: { value: "", type: "chirpstack-connection" },
      name: { value: "" },
      action: { value: "createMacReq" },
    },
    inputs: 1,
    outputs: 1,
    icon: "chirpstack.png",
    paletteLabel: "ChirpStack network server requests",
    label() {
      return this.name || "ChirpStack network server requests";
    },
  }
);
