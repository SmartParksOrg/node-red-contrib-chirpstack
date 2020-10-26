import { EditorRED } from "node-red";
import { ChirpstackApplicationManagementEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackApplicationManagementEditorNodeProperties>(
  "chirpstack-application-management",
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
    paletteLabel: "ChirpStack Applications",
    label() {
      return this.name || "Chirpstack Applications";
    },
  }
);
