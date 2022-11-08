import fs from 'fs';
import pathTools from 'path';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import { parse, compileScript } from '@vue/compiler-sfc';
import 'url';
import { createRequire } from 'module';

const DEFAULT_EXTENSIONS = [".js", ".ts", ".tsx", ".vue", ".json", ".jsx"];
const bareModuleRE = /^[\w@][^:/]+/;

createRequire(import.meta.url);
const isNpmPath = (path) => bareModuleRE.test(path);

let config_ = null;
/**
 * 扫描依赖的入口函数
 * @param entry 扫描入口路径
 * @param config 配置选项
 * @returns DepTree
 */
function main(entry, config) {
    const absPath = pathTools.resolve(entry);
    config_ = {
        skipTypeImport: true,
        ...config
    };
    depTreeCacheMap.clear();
    const depsTree = createDepsTree(absPath);
    return depsTree;
}
// 依赖节点缓存
const depTreeCacheMap = new Map();
/**
 * 创建依赖树
 * @param path 分析文件的路径
 * @returns DepTree
 */
function createDepsTree(path) {
    // 复用已解析过的依赖节点
    if (depTreeCacheMap.has(path)) {
        return depTreeCacheMap.get(path);
    }
    // 获取依赖
    const deps = getDeps(path);
    depTreeCacheMap.set(path, deps);
    deps.forEach((item) => {
        item.children = createDepsTree(item.localPath);
    });
    return deps;
}
/**
 * 获取文件依赖
 * @param cwf 当前工作文件路径
 * @returns 依赖数组
 */
function getDeps(cwf) {
    // console.log("cwf", cwf);
    // 利用babel的能力，查找文件中的import语句
    const deps = [];
    try {
        let fileCode = fs.readFileSync(cwf).toString();
        // 处理vue-sfc类型的文件
        if (pathTools.extname(cwf) === ".vue") {
            const { descriptor, errors } = parse(fileCode, {
                sourceMap: false,
                filename: cwf,
            });
            if (errors.length > 0) {
                throw new Error(`解析vue文件出错,原因是:${errors.join("/n")}`);
            }
            fileCode = compileScript(descriptor, {
                id: cwf,
                sourceMap: false,
            }).content;
        }
        const ast = parser.parse(fileCode, {
            plugins: [
                "typescript",
                "jsx",
                [
                    "decorators",
                    {
                        decoratorsBeforeExport: true,
                    },
                ],
            ],
            sourceType: "module"
        });
        let importVars = [];
        traverse.default(ast, {
            enter(path) {
                const node = path.node, scope = path.scope;
                let importPath = "";
                switch (node.type) {
                    case "ImportDeclaration":
                        // 跳过纯类型引用 import type xxx from 'xxx'
                        if (config_.skipTypeImport && node.importKind !== "value") {
                            break;
                        }
                        importPath = node?.source.value;
                        // 排除未引用的导入变量
                        importVars = node.specifiers
                            .filter((item) => scope.bindings[item.local.name].referenced)
                            .map((item) => ({
                            type: item.type,
                            name: item.type === "ImportSpecifier"
                                ? item.imported.name
                                : item.local.name,
                        }));
                        break;
                    case "CallExpression":
                        if (node.callee.type === "Import") {
                            importPath = node.arguments[0]?.value;
                        }
                        break;
                }
                if (!importPath) {
                    return;
                }
                // 排除npm包类型的依赖
                if (isNpmPath(importPath)) {
                    return;
                }
                // 排除一些无需进一步分析的文件类型，主要是一些资源文件
                const extname = pathTools.extname(importPath);
                if (extname && DEFAULT_EXTENSIONS.includes(extname) === false) {
                    return;
                }
                const resolvedPath = transformImportPath(importPath, pathTools.dirname(cwf));
                if (!resolvedPath) {
                    return;
                }
                deps.push({
                    path: resolvedPath.replace(process.cwd(), ""),
                    localPath: resolvedPath,
                    // shortPath: ,
                    importVars,
                });
            },
        });
    }
    catch (error) {
        console.log(`已跳过${cwf},原因是:${error}`);
    }
    return deps;
}
/**
 * 处理源码中的import路径
 * @param importPath 源码文件路径
 * @param cwd 当前文件所处目录
 * @returns 绝对文件路径
 */
function transformImportPath(importPath, cwd) {
    if (isNpmPath(importPath)) {
        return;
    }
    let _path = importPath;
    // 应用路径别名 eg:@/utils/index
    config_.resolveAlias &&
        Object.entries(config_.resolveAlias).forEach(([k, v]) => {
            _path = _path.replace(k, v);
        });
    // 兼容路径不完整的导入
    if (!pathTools.extname(_path)) {
        for (let i = 0; i < DEFAULT_EXTENSIONS.length; i++) {
            const extName = DEFAULT_EXTENSIONS[i];
            // eg: ./utils/index
            const addExtPath = pathTools.resolve(cwd, `${_path}${extName}`);
            // eg: ./utils
            const addExtAndIndexPath = pathTools.resolve(cwd, `${_path}/index${extName}`);
            if (fs.existsSync(addExtPath)) {
                _path = addExtPath;
                break;
            }
            else if (fs.existsSync(addExtAndIndexPath)) {
                _path = addExtAndIndexPath;
                break;
            }
        }
    }
    return pathTools.resolve(cwd, _path);
}

export { main as default, getDeps };
//# sourceMappingURL=index.js.map
