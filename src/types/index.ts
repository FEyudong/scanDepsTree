export interface DepNode {
  path: string;
  localPath: string;
  importVars: string[]
  children: DepNode[];
}

export type DepTree = DepNode[];


