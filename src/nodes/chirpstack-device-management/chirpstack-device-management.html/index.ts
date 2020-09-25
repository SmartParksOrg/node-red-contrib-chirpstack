import { EditorRED } from "node-red";
import { ChirpstackDeviceManagementEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackDeviceManagementEditorNodeProperties>(
  "chirpstack-device-management",
  {
    category: "chirpstack",
    color: "#a6bbcf",
    defaults: {
      connection: { value: "", type: "chirpstack-connection" },
      name: { value: "" },
      action: { value: "list" },
    },
    inputs: 1,
    outputs: 1,
    icon: "chirpstack.png",
    paletteLabel: "chirpstack device management",
    label() {
      return this.name || "chirpstack device management";
    },
  }
);
