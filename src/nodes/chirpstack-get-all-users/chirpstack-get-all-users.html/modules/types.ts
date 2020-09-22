import { EditorNodeProperties } from "node-red";
import { ChirpstackGetAllUsersOptions } from "../../shared/types";

export interface ChirpstackGetAllUsersEditorNodeProperties
  extends EditorNodeProperties,
    ChirpstackGetAllUsersOptions {}
