import { EditorNodeProperties } from "node-red";
import { ChirpstackDeviceProfileManagementOptions } from "../../shared/types";

export interface ChirpstackDeviceProfileManagementEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackDeviceProfileManagementOptions {}
