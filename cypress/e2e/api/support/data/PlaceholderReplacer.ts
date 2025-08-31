import { PlaceholderConfigMap } from "../types/placeholderConfigMap";

export class PlaceholderReplacer {
  PLACEHOLDER_CONFIG: PlaceholderConfigMap = {
    userData: {
      longPassword: {
        field: "password",
        placeholder: "LONG_PASSWORD_PLACEHOLDER",
        replacement: "A".repeat(129),
      },
    },
    noteData: {
      longTitle: {
        field: "title",
        placeholder: "LONG_TITLE_PLACEHOLDER",
        replacement: "A".repeat(1001),
      },
      validNote: {
        field: "title",
        placeholder: "TIMESTAMP_PLACEHOLDER",
        replacement: Date.now().toString(),
      },
      titleOnlyNote: {
        field: "title",
        placeholder: "TIMESTAMP_PLACEHOLDER",
        replacement: Date.now().toString(),
      }
    },
    apiData: {
      extremelyLargePayload: {
        field: "description",
        placeholder: "LONG_TITLE_PLACEHOLDER",
        replacement: "A".repeat(100001),
      },
    },
  };

  replacePlaceholder<K extends keyof PlaceholderConfigMap>(
    dataObj: any,
    category: K,
    key: keyof PlaceholderConfigMap[K]
  ): boolean {
    const categoryConfig = this.PLACEHOLDER_CONFIG[category];
    const config = categoryConfig[key] as any;

    if (!config) return false;

    const item = dataObj[key];
    if (item && item[config.field] === config.placeholder) {
      item[config.field] = config.replacement;
      return true;
    }
    return false;
  }

  /**
   * Replaces placeholders in a specific field of an object
   * @param obj - The object to modify
   * @param field - The field to check for placeholders
   * @param placeholder - The placeholder to replace
   * @param replacement - The replacement value
   */
  replaceInObject(obj: any, field: string, placeholder: string, replacement: string): boolean {
    if (obj && obj[field] === placeholder) {
      obj[field] = replacement;
      return true;
    }
    return false;
  }
}