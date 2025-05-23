import debug from 'debug';
/**
 * This creates a debug logger instance to be used within our internal code.
 * @see https://www.npmjs.com/package/debug to see how to use the logger at runtime
 * @see wallet.ts makes extensive use of this function.
 * @param name The root namespace to assign to the log messages
 */
export declare function makeDebug(name: string): debug.Debugger;
