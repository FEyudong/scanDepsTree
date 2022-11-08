import { fileURLToPath } from "url";
import { dirname } from "path";
import { bareModuleRE } from './consts';
import path from "path";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
import type {Config} from "./types/config"

// 方便在es-module获取类似于cjs里的 __dirname __filename等变量

export const getFilename = () => fileURLToPath(import.meta.url);

export const getDirname = () => dirname(getFilename());

export const isNpmPath = (path:string)=> bareModuleRE.test(path)

export const getConfig = (): Config =>{
    try {
       return 
    } catch (error) {
      console.log(error)
       throw new Error('缺少.galaxyrc.js配置文件')  
    }
}