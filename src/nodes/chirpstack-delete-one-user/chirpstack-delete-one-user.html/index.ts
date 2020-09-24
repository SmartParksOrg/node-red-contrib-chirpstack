import { EditorRED } from "node-red";
import { ChirpstackDeleteOneUserEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackDeleteOneUserEditorNodeProperties>(
  "chirpstack-delete-one-user",
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
    paletteLabel: "chirpstack delete one user",
    label() {
      return this.name || "chirpstack delete one user";
    },
  }
);
