import { EditorRED } from "node-red";
import { ChirpstackUpdateOneUserEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackUpdateOneUserEditorNodeProperties>(
  "chirpstack-update-one-user",
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
    paletteLabel: "chirpstack update one user",
    label() {
      return this.name || "chirpstack update one user";
    },
  }
);
