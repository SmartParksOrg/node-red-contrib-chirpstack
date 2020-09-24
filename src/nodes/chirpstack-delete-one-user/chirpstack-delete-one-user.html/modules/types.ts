import { EditorNodeProperties } from "node-red";
import { ChirpstackDeleteOneUserOptions } from "../../shared/types";

export interface ChirpstackDeleteOneUserEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackDeleteOneUserOptions {}
