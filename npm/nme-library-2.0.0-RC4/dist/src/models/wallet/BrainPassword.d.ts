import { Password } from "./Password";
/**
 * Brain password is an extended version of Password. With the brain password we derive the private key in BrainWallets.
 */
export declare class BrainPassword extends Password {
    /**
     * Constructor
     * @param password - password must be secure, the password must be at least a 12 random words password.
     */
    constructor(password: string);
}
