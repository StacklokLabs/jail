export declare const __comment: string;
export declare const bytecode: string;
export declare const abi: ({
    "constant": boolean;
    "inputs": {
        "name": string;
        "type": string;
    }[];
    "name": string;
    "outputs": {
        "name": string;
        "type": string;
    }[];
    "payable": boolean;
    "stateMutability": string;
    "type": string;
    anonymous?: undefined;
} | {
    "inputs": never[];
    "payable": boolean;
    "stateMutability": string;
    "type": string;
    constant?: undefined;
    name?: undefined;
    outputs?: undefined;
    anonymous?: undefined;
} | {
    "anonymous": boolean;
    "inputs": {
        "indexed": boolean;
        "name": string;
        "type": string;
    }[];
    "name": string;
    "type": string;
    constant?: undefined;
    outputs?: undefined;
    payable?: undefined;
    stateMutability?: undefined;
})[];
