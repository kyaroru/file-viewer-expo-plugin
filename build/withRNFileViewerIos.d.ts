import { ConfigPlugin } from "@expo/config-plugins";
import { MergeResults } from "@expo/config-plugins/build/utils/generateCode";
export declare function addFileViewerCocoaPods(src: string, fileViewerPath: string): MergeResults;
export declare function removeFileViewerCocoaPods(src: string): MergeResults;
declare const initPlugin: ConfigPlugin;
export default initPlugin;
