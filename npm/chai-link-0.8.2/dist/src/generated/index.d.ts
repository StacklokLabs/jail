import { BigNumberish, EventDescription, FunctionDescription } from "ethers/utils";
export declare class TransactionOverrides {
    nonce?: BigNumberish | Promise<BigNumberish>;
    gasLimit?: BigNumberish | Promise<BigNumberish>;
    gasPrice?: BigNumberish | Promise<BigNumberish>;
    value?: BigNumberish | Promise<BigNumberish>;
    chainId?: number | Promise<number>;
}
export interface TypedEventDescription<T extends Pick<EventDescription, "encodeTopics">> extends EventDescription {
    encodeTopics: T["encodeTopics"];
}
export interface TypedFunctionDescription<T extends Pick<FunctionDescription, "encode">> extends FunctionDescription {
    encode: T["encode"];
}
export * from './AggregatorFactory';
export * from './AggregatorInterfaceFactory';
export * from './AggregatorProxyFactory';
export * from './BasicConsumerFactory';
export * from './ChainlinkClientFactory';
export * from './ChainlinkRequestInterfaceFactory';
export * from './ChainlinkedFactory';
export * from './ConcreteChainlinkFactory';
export * from './ConcreteChainlinkedFactory';
export * from './ConcreteSignedSafeMathFactory';
export * from './ConsumerFactory';
export * from './ENSFactory';
export * from './ENSInterfaceFactory';
export * from './ENSRegistryFactory';
export * from './ENSResolverFactory';
export * from './EmptyOracleFactory';
export * from './GetterSetterFactory';
export * from './LinkTokenFactory';
export * from './LinkTokenInterfaceFactory';
export * from './MaliciousChainlinkedFactory';
export * from './MaliciousConsumerFactory';
export * from './MaliciousRequesterFactory';
export * from './MigrationsFactory';
export * from './OracleFactory';
export * from './OracleInterfaceFactory';
export * from './OwnableFactory';
export * from './PointerFactory';
export * from './PointerInterfaceFactory';
export * from './PublicResolverFactory';
export * from './UpdatableConsumerFactory';
