import type { Config } from "./types/config";
export declare const getFilename: () => string;
export declare const getDirname: () => string;
export declare const isNpmPath: (path: string) => boolean;
export declare const getConfig: () => Config;
