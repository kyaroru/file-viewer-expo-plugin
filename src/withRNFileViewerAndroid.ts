import {
  ConfigPlugin,
  ExportedConfigWithProps,
  withAndroidManifest,
} from "@expo/config-plugins";
import { ExpoConfig } from "@expo/config-types";

const withQueryIntent: ConfigPlugin = (config: ExpoConfig) => {
  return withAndroidManifest(
    config,
    async (newConfig: ExportedConfigWithProps<any>) => {
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
    }
  );
};

const initPlugin: ConfigPlugin = (config) => {
  config = withQueryIntent(config);
  return config;
};

export default initPlugin;
