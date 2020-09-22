import { EditorRED } from "node-red";
import { ChirpstackBaseEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackBaseEditorNodeProperties>("chirpstack-base", {
  category: "function",
  color: "#a6bbcf",
  defaults: {
    connection: { value: "", type: "chirpstack-connection" },
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "file.png",
  paletteLabel: "chirpstack base",
    label() {
        return this.name || "chirpstack base";
    },
});
