# scanDepsTree

> 扫描js模块依赖树
## 简介

从一个入口文件出发, 递归构建模块依赖树。常用于文件依赖分析、代码治理等方向，支持js、ts、tsx、.vue等丰富的模块类型。
## 安装
```
npm i scan-deps-tree -D
```

## 使用

1. 命令行使用
```shell
npx scan xxx.js //分析的路径
```
执行完会在当前目录创建`depTree.json`文件

2. 导出函数使用
```js
import scanDepsTree from 'scan-deps-tree'

const depTree = scanDepsTree('./src/index.ts',{
    resolveAlias:{ // webpack中配置的路径别名
        @:'xxx'
    },
    skipTypeImport: true // 是否忽略import type xxx的模块声明。默认为true
})
console.log(depTree)
```