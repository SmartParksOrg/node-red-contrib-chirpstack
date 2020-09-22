import { EditorNodeProperties } from "node-red";
import { ChirpstackBaseOptions } from "../../shared/types";

export interface ChirpstackBaseEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackBaseOptions {}
