import { EditorRED } from "node-red";
import { ChirpstackGetAllUsersEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackGetAllUsersEditorNodeProperties>(
  "chirpstack-get-all-users",
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
    paletteLabel: "chirpstack get all users",
    label() {
      return this.name || "chirpstack get all users";
    },
  }
);
