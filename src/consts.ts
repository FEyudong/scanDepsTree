export const KNOWN_ASSET_TYPES = [
  // images
  "png",
  "jpe?g",
  "jfif",
  "pjpeg",
  "pjp",
  "gif",
  "svg",
  "ico",
  "webp",
  "avif",

  // media
  "mp4",
  "webm",
  "ogg",
  "mp3",
  "wav",
  "flac",
  "aac",

  // fonts
  "woff2?",
  "eot",
  "ttf",
  "otf",

  // other
  "webmanifest",
  "pdf",
  "txt",
];

export const DEFAULT_EXTENSIONS = [".js", ".ts", ".tsx",".vue", ".json", ".jsx"];

export const JS_TYPES_RE = /\.(?:j|t)sx?$|\.mjs$/;

export const bareModuleRE = /^[\w@][^:/]+/;
