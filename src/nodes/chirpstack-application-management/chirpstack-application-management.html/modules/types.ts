import { EditorNodeProperties } from "node-red";
import { ChirpstackApplicationManagementOptions } from "../../shared/types";

export interface ChirpstackApplicationManagementEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackApplicationManagementOptions {}
