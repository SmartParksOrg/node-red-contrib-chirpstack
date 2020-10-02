import { EditorRED } from "node-red";
import { ChirpstackOrganizationManagementEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackOrganizationManagementEditorNodeProperties>(
 "chirpstack-organization-management",
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
    paletteLabel: "ChirpStack Organizations",
    label() {
      return this.name || "ChirpStack Organizations";
    },
  }
);
