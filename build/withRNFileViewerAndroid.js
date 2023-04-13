"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withQueryIntent = (config) => {
    return (0, config_plugins_1.withAndroidManifest)(config, async (newConfig) => {
        const contents = newConfig.modResults;
        contents.manifest.queries = [
            {
                intent: {
                    action: {
                        $: {
                            "android:name": "android.intent.action.VIEW",
                        },
                    },
                    data: [
                        {
                            $: {
                                "android:mimeType": "*/*",
                            },
                        },
                    ],
                },
            },
        ];
        return newConfig;
    });
};
const initPlugin = (config) => {
    config = withQueryIntent(config);
    return config;
};
exports.default = initPlugin;
