import { PlaceholderConfig } from "./placeholderConfig";

export interface PlaceholderConfigMap {
  userData: {
    longPassword: PlaceholderConfig;
  };
  noteData: {
    longTitle: PlaceholderConfig;
    validNote: PlaceholderConfig;
    titleOnlyNote: PlaceholderConfig;
  };
  apiData: {
    extremelyLargePayload: PlaceholderConfig;
  };
}
