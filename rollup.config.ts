import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import path from "path";
import { defineConfig } from "rollup";
import pkg from "./package.json";

export default defineConfig({
  input: path.resolve(__dirname, "./src/index.ts"),
  output: [
    {
      dir: path.resolve(__dirname, `./dist/cjs`),
      format: "cjs",
      sourcemap: true,
    },
    {
      dir: path.resolve(__dirname, `./dist/esm`),
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: path.resolve(__dirname, "./tsconfig.json"),
      tsconfigOverride: {
        compilerOptions: {
          declaration: true, //自动生成d.ts文件
        },
      },
      abortOnError:false
    }),
    json(),
    nodeResolve(),
    commonjs(),
  ],
  external: [...Object.keys(pkg.dependencies)],
});
