import { IConfig, DateYMD } from './types';
export default class Signature {
    static getSignature(config: IConfig, date: DateYMD, policyBase64: string): string;
}
