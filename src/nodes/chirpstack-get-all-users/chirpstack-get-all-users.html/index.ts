import { EditorRED } from "node-red";
import { ChirpstackGetAllUsersEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ChirpstackGetAllUsersEditorNodeProperties>(
  "chirpstack-get-all-users",
  {
    category: "function",
    color: "#a6bbcf",
    defaults: {
      name: { value: "" },
    },
    inputs: 1,
    outputs: 1,
    icon: "file.png",
    paletteLabel: "chirpstack get all users",
    label: function () {
      return this.name || "chirpstack get all users";
    },
  }
);
