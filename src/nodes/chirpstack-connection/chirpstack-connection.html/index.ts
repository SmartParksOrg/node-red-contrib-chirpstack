import { EditorRED } from "node-red";
import { ChirpstackConnectionEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackConnectionEditorNodeProperties>(
  "chirpstack-connection",
  {
    category: "config",
    color: "#a6bbcf",
    defaults: {
      host: { value: "localhost", required: true },
      port: { value: 8080, required: true, validate: RED.validators.number() },
      username: { value: "Username", required: true },
      password: { value: "Password", required: true, type: "password" },
    },
    inputs: 1,
    outputs: 1,
    icon: "file.png",
    paletteLabel: "chirpstack connection",
    label() {
      return this.host + ":" + this.port;
    },
  }
);
