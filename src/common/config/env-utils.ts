// copy from https://github.com/w3tecch/express-typescript-boilerplate/blob/develop/src/lib/env/utils.ts

import { join } from "path";

export function getOsEnv(key: string): string {
  if (typeof process.env[key] === "undefined") {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key] as string;
}

export function getOsEnvOrDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export function getPath(path: string): string {
  return process.env.NODE_ENV === "prod"
    ? join(process.cwd(), "dist/", path)
    : join(process.cwd(), "src/", path);
}

export function getPaths(paths: string[]): string[] {
  return paths.map((p) => getPath(p));
}

export function getOsPath(key: string): string {
  return getPath(getOsEnv(key));
}

export function parseIntOrThrow(value: string): number {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Failed to parse ${value} into a number`);
  }
  return parsed;
}

export function parseBoolOrThrow(value: string): boolean {
  if (["true", "false"].indexOf(value) < 0) {
    throw new Error(`Failed to parse ${value} into a boolean`);
  }
  return value === "true";
}

export function parseList(value: string): string[] {
  return value.split(",");
}

export function parseListOrDefault<T>(
  value: string,
  defaultValue: T
): string[] | T {
  return value ? parseList(value) : defaultValue;
}
