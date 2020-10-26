import { EditorRED } from "node-red";
import { ChirpstackDeviceProfileManagementEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackDeviceProfileManagementEditorNodeProperties>(
  "chirpstack-device-profile-management",
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
    paletteLabel: "ChirpStack Device Profiles",
    label() {
      return this.name || "ChirpStack Device Profiles";
    },
  }
);
