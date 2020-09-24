import { EditorRED } from "node-red";
import { ChirpstackCreateOneUserEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackCreateOneUserEditorNodeProperties>(
  "chirpstack-create-one-user",
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
    paletteLabel: "chirpstack create one user",
    label() {
      return this.name || "chirpstack create one user";
    },
  }
);
