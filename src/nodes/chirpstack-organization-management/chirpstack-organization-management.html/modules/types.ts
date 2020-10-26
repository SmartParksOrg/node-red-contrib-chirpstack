import { EditorNodeProperties } from "node-red";
import { ChirpstackOrganizationManagementOptions } from "../../shared/types";

export interface ChirpstackOrganizationManagementEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackOrganizationManagementOptions {}
