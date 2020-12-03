import { EditorNodeProperties } from "node-red";
import { ChirpstackNetworkServerOptions } from "../../shared/types";

export interface ChirpstackNetworkServerEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackNetworkServerOptions {}
