import { EditorNodeProperties } from "node-red";
import { ChirpstackDeviceManagementOptions } from "../../shared/types";

export interface ChirpstackDeviceManagementEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackDeviceManagementOptions {}
