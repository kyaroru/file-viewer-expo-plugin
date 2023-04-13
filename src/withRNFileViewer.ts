
 

import { ConfigPlugin } from "@expo/config-plugins";
import withRNFileViewerAndroid from "./withRNFileViewerAndroid";
import withRNFileViewerIos from "./withRNFileViewerIos";

const withViro: ConfigPlugin = (config) => {
  config = withRNFileViewerIos(config);
  config = withRNFileViewerAndroid(config);

  return config;
};

export default withViro;