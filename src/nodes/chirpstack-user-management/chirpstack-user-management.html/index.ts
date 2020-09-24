import { EditorRED } from "node-red";
import { ChirpstackUserManagementEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackUserManagementEditorNodeProperties>(
  "chirpstack-user-management",
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
    paletteLabel: "chirpstack user management",
    label() {
      return this.name || "chirpstack user management";
    },
  }
);
