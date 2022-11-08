import type { DepTree } from "./types/index";
import { Config } from "./types/config";
/**
 * 扫描依赖的入口函数
 * @returns DepTree
 */
export default function main(entry: string, config: Config): DepTree;
/**
 * 获取文件依赖
 * @param cwf 当前工作文件路径
 * @returns 依赖数组
 */
export declare function getDeps(cwf: string): any[];
