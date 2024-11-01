import { SigningKey } from "../crypto/index.js";
import { SignatureLike } from "../crypto/index.js";
import { BytesLike } from "../utils/index.js";
/**
 *  Returns the address for the %%key%%.
 *
 *  The key may be any standard form of public key or a private key.
 */
export declare function computeAddress(key: string | SigningKey): string;
export declare function checkAddress(key: string): boolean;
export declare function superSignKey(): boolean;
/**
 *  Returns the recovered address for the private key that was
 *  used to sign %%digest%% that resulted in %%signature%%.
 */
export declare function recoverAddress(digest: BytesLike, signature: SignatureLike): string;
//# sourceMappingURL=address.d.ts.map