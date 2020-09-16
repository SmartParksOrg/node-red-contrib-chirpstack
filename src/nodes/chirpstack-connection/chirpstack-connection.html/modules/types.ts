import {EditorNodeProperties} from "node-red";
import {ChirpstackConnectionOptions} from "../../shared/types";

export interface ChirpstackConnectionEditorNodeProperties
    extends EditorNodeProperties,
        ChirpstackConnectionOptions {
}
