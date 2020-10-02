import { EditorNodeProperties } from "node-red";
import { ChirpstackGatewayManagementOptions } from "../../shared/types";

export interface ChirpstackGatewayManagementEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackGatewayManagementOptions {}
