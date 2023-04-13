import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import {
  MergeResults,
  mergeContents,
  removeContents,
} from "@expo/config-plugins/build/utils/generateCode";
import { ExpoConfig } from "@expo/config-types";
import path from "path";
import fs from "fs-extra";
import resolveFrom from "resolve-from";

const debug = require("debug")("file-viewer-plugin") as typeof console.log;

function isReactNativeFileViewerAutolinked(
  config: Pick<ExpoConfig, "_internal">
): boolean {
  // TODO: Detect autolinking
  return true;
}

export function addFileViewerCocoaPods(
  src: string,
  fileViewerPath: string
): MergeResults {
  return mergeContents({
    tag: "react-native-file-viewer",
    src,
    newSrc: `pod 'RNFileViewer', :path => '${fileViewerPath}'`,
    anchor: /use_native_modules/,
    offset: 0,
    comment: "#",
  });
}

export function removeFileViewerCocoaPods(src: string): MergeResults {
  return removeContents({
    tag: "react-native-file-viewer",
    src,
  });
}

function isReactNativeFileViewerInstalled(projectRoot: string): string | null {
  const resolved = resolveFrom.silent(
    projectRoot,
    "react-native-file-viewer/package.json"
  );
  return resolved ? path.dirname(resolved) : null;
}

const withFileViewerCocoaPods: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const filePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      const contents = await fs.readFile(filePath, "utf-8");
      let results: MergeResults;
      // Only add the block if react-native-file-viewer is installed in the project (best effort).
      // Generally prebuild runs after a yarn install so this should always work as expected.
      const fileViewerPath = isReactNativeFileViewerInstalled(
        config.modRequest.projectRoot
      );
      const isLinked = isReactNativeFileViewerAutolinked(config);
      debug("Is Expo Autolinked:", isLinked);
      debug("react-native-file-viewer path:", fileViewerPath);
      if (isLinked && fileViewerPath) {
        // Make the pod path relative to the ios folder.
        const fileViewerPodPath = path.relative(
          config.modRequest.platformProjectRoot,
          fileViewerPath
        );
        try {
          results = addFileViewerCocoaPods(contents, fileViewerPodPath);
        } catch (error: any) {
          if (error.code === "ERR_NO_MATCH") {
            throw new Error(
              `Cannot add react-native-file-viewer to the project's ios/Podfile because it's malformed. Please report this with a copy of your project Podfile.`
            );
          }
          throw error;
        }
      } else {
        // If the package is no longer installed, then remove the block.
        results = removeFileViewerCocoaPods(contents);
      }
      if (results.didMerge || results.didClear) {
        await fs.writeFile(filePath, results.contents);
      }
      return config;
    },
  ]);
};

const initPlugin: ConfigPlugin = (config) => {
  config = withFileViewerCocoaPods(config);
  return config;
};

export default initPlugin;
