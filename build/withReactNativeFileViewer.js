"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFileViewerCocoaPods = exports.addFileViewerCocoaPods = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const resolve_from_1 = __importDefault(require("resolve-from"));
const debug = require('debug')('file-viewer-plugin');
function isReactNativeFileViewerAutolinked(config) {
    // TODO: Detect autolinking
    return true;
}
// const fileViewer = '../node_modules/react-native-file-viewer'
function addFileViewerCocoaPods(src, fileViewerPath) {
    return (0, generateCode_1.mergeContents)({
        tag: "react-native-file-viewer",
        src,
        newSrc: `pod 'RNFileViewer', :path => '${fileViewerPath}'`,
        anchor: /use_native_modules/,
        offset: 0,
        comment: "#",
    });
}
exports.addFileViewerCocoaPods = addFileViewerCocoaPods;
function removeFileViewerCocoaPods(src) {
    return (0, generateCode_1.removeContents)({
        tag: "react-native-file-viewer",
        src,
    });
}
exports.removeFileViewerCocoaPods = removeFileViewerCocoaPods;
function isReactNativeFileViewerInstalled(projectRoot) {
    const resolved = resolve_from_1.default.silent(projectRoot, 'react-native-file-viewer/package.json');
    return resolved ? path_1.default.dirname(resolved) : null;
}
const withFileViewerCocoaPods = (config) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "ios",
        async (config) => {
            const filePath = path_1.default.join(config.modRequest.platformProjectRoot, "Podfile");
            const contents = await fs_extra_1.default.readFile(filePath, "utf-8");
            let results;
            // Only add the block if react-native-file-viewer is installed in the project (best effort).
            // Generally prebuild runs after a yarn install so this should always work as expected.
            const fileViewerPath = isReactNativeFileViewerInstalled(config.modRequest.projectRoot);
            const isLinked = isReactNativeFileViewerAutolinked(config);
            debug("Is Expo Autolinked:", isLinked);
            debug("react-native-file-viewer path:", fileViewerPath);
            if (isLinked && fileViewerPath) {
                // Make the pod path relative to the ios folder.
                const fileViewerPodPath = path_1.default.relative(config.modRequest.platformProjectRoot, fileViewerPath);
                try {
                    results = addFileViewerCocoaPods(contents, fileViewerPodPath);
                }
                catch (error) {
                    if (error.code === "ERR_NO_MATCH") {
                        throw new Error(`Cannot add react-native-file-viewer to the project's ios/Podfile because it's malformed. Please report this with a copy of your project Podfile.`);
                    }
                    throw error;
                }
            }
            else {
                // If the package is no longer installed, then remove the block.
                results = removeFileViewerCocoaPods(contents);
            }
            if (results.didMerge || results.didClear) {
                await fs_extra_1.default.writeFile(filePath, results.contents);
            }
            return config;
        },
    ]);
};
const initPlugin = (config) => {
    config = withFileViewerCocoaPods(config);
    return config;
};
exports.default = initPlugin;
