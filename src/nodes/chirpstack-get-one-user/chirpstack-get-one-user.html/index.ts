import { EditorRED } from "node-red";
import { ChirpstackGetOneUserEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackGetOneUserEditorNodeProperties>(
  "chirpstack-get-one-user",
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
    paletteLabel: "chirpstack get one user",
    label() {
      return this.name || "chirpstack get one user";
    },
  }
);
