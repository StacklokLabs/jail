import { PackageJson } from './filesystem';
declare type Dependencies = Pick<PackageJson, 'dependencies' | 'devDependencies' | 'bundledDependencies' | 'peerDependencies'>;
export declare function getDependencies(packageJSON: PackageJson): Required<Dependencies>;
export declare function getDecentralandDependencies(dependencies: Record<string, string>, workDir: string): Promise<string[]>;
export {};
//# sourceMappingURL=installedDependencies.d.ts.map