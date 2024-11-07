/// <reference types="node" />
import { EventEmitter } from 'events';
import { DCLInfo } from '../config';
import { LinkerResponse } from './LinkerAPI';
import { IdentityType } from '@dcl/crypto';
import { EthAddress } from '@dcl/schemas';
export declare type WorldsContentServerArguments = {
    worldName: string;
    allowed: EthAddress[];
    oldAllowed: EthAddress[];
    targetContent: string;
    linkerPort?: number;
    isHttps?: boolean;
    config?: DCLInfo;
    method: 'put' | 'delete';
};
export declare class WorldsContentServer extends EventEmitter {
    options: WorldsContentServerArguments;
    targetContent: string;
    environmentIdentity?: IdentityType;
    constructor(args: WorldsContentServerArguments);
    link(payload: string): Promise<LinkerResponse>;
    getAddressAndSignature(messageToSign: string): Promise<LinkerResponse>;
    private pipeEvents;
    private createWallet;
}
//# sourceMappingURL=WorldsContentServer.d.ts.map