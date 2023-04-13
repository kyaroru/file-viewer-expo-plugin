import { ConfigPlugin, ExportedConfigWithProps, withAndroidManifest } from "@expo/config-plugins";

const withQueryIntent: ConfigPlugin = (config) => {
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
    }
  );
};

const initPlugin: ConfigPlugin = (config) => {
  config = withQueryIntent(config);
  return config;
};

export default initPlugin;
