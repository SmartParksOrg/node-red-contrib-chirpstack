import { EditorNodeProperties } from "node-red";
import { ChirpstackCreateOneUserOptions } from "../../shared/types";

export interface ChirpstackCreateOneUserEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackCreateOneUserOptions {}
