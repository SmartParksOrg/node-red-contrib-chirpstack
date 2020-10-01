import { EditorNodeProperties } from "node-red";
import { ChirpstackUserManagementOptions } from "../../shared/types";

export interface ChirpstackUserManagementEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackUserManagementOptions {}
