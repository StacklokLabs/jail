import { TronWeb } from '../tronweb.js';
interface PluginConstructorOptions {
    disablePlugins?: boolean;
}
interface PluginClassInterface {
    new (tronWeb: TronWeb): {
        pluginInterface?: (options: PluginOptions) => PluginInterfaceReturn;
    };
}
interface PluginInterfaceReturn {
    requires: string;
    components?: Record<string | number | symbol, any>;
    fullClass?: boolean;
}
type PluginOptions = any;
export declare class Plugin {
    tronWeb: TronWeb;
    pluginNoOverride: string[];
    disablePlugins: boolean;
    constructor(tronWeb: TronWeb, options?: PluginConstructorOptions);
    register(Plugin: PluginClassInterface, options?: PluginOptions): {
        libs: any[];
        plugged: any[];
        skipped: any[];
        error?: string;
    };
}
export {};
