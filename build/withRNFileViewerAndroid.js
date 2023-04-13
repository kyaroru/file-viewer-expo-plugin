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
                                "android:mimeType": "image/*",
                            },
                        },
                        {
                            $: {
                                "android:mimeType": "application/pdf",
                            },
                        },
                        {
                            $: {
                                "android:mimeType": "application/zip",
                            },
                        },
                        {
                            $: {
                                "android:mimeType": "text/plain",
                            },
                        },
                        {
                            $: {
                                "android:mimeType": "text/csv",
                            },
                        },
                        {
                            $: {
                                "android:mimeType": "application/msword",
                            },
                        },
                        {
                            $: {
                                "android:mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            },
                        },
                        {
                            $: {
                                "android:mimeType": "application/vnd.ms-powerpoint",
                            },
                        },
                        {
                            $: {
                                "android:mimeType": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                            },
                        },
                        {
                            $: {
                                "android:mimeType": "application/vnd.ms-excel",
                            },
                        },
                        {
                            $: {
                                "android:mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
