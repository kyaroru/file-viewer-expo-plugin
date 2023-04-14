"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const withRNFileViewerAndroid_1 = __importDefault(require("./withRNFileViewerAndroid"));
const withRNFileViewerIos_1 = __importDefault(require("./withRNFileViewerIos"));
const withViro = (config) => {
    config = (0, withRNFileViewerIos_1.default)(config);
    config = (0, withRNFileViewerAndroid_1.default)(config);
    return config;
};
exports.default = withViro;
