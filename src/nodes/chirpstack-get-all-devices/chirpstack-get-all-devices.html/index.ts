import { EditorRED } from "node-red";
import { ChirpstackGetAllDevicesEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackGetAllDevicesEditorNodeProperties>(
  "chirpstack-get-all-devices",
  {
    category: "chirpstack",
    color: "#a6bbcf",
    defaults: {
      connection: { value: "", type: "chirpstack-connection" },
      name: { value: "" },
    },
    inputs: 1,
    outputs: 1,
    icon: "file.png",
    paletteLabel: "chirpstack get all devices",
    label() {
      return this.name || "chirpstack get all devices";
    },
  }
);
