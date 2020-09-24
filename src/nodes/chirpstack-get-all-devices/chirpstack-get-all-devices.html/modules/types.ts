import { EditorNodeProperties } from "node-red";
import { ChirpstackGetAllDevicesOptions } from "../../shared/types";

export interface ChirpstackGetAllDevicesEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackGetAllDevicesOptions {}
