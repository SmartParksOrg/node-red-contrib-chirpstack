import { EditorRED } from "node-red";
import { ChirpstackUserManagementEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackUserManagementEditorNodeProperties>(
  "chirpstack-user-management",
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
    paletteLabel: "ChirpStack Users",
    label() {
      return this.name || "ChirpStack Users";
    },
  }
);
