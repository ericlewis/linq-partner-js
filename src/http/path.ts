export type PathParamsRecord = Record<string, string | number | boolean>;

const PATH_PARAM_PATTERN = /{([^}]+)}/g;

export function interpolatePath(template: string, params?: PathParamsRecord): string {
  if (!params) {
    return template;
  }

  return template.replace(PATH_PARAM_PATTERN, (_match, key: string) => {
    if (!(key in params)) {
      throw new Error(`Missing required path param: ${key}`);
    }

    return encodeURIComponent(String(params[key]));
  });
}
