import { EditorNodeProperties } from "node-red";
import { ChirpstackUpdateOneUserOptions } from "../../shared/types";

export interface ChirpstackUpdateOneUserEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackUpdateOneUserOptions {}
