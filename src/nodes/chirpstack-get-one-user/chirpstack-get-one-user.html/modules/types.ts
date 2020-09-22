import { EditorNodeProperties } from "node-red";
import { ChirpstackGetOneUserOptions } from "../../shared/types";

export interface ChirpstackGetOneUserEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackGetOneUserOptions {}
