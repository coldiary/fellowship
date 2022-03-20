import { refreshAccount, transactionServices } from '@elrondnetwork/dapp-core';
import { SimpleTransactionType } from '@elrondnetwork/dapp-core/build/types/transactions';
import {
    AbiRegistry,
    Address,
    AddressValue,
    ArgSerializer,
    BigUIntValue,
    BytesValue,
    ContractFunction,
    OptionalType,
    OptionalValue,
    ProxyProvider,
    Query,
    TokenIdentifierValue,
    TransactionPayload,
    TypedValue,
    U64Value,
} from '@elrondnetwork/erdjs';
import { BigNumber } from '@elrondnetwork/erdjs/node_modules/bignumber.js';

const { sendTransactions } = transactionServices;

export class ContractSerializer {
    static encodeU64Value = (value: number) => new U64Value(new BigNumber(value));
    static encodeBigUInt = (value: number) => new BigUIntValue(new BigNumber(value));
    static encodeTokenIdentifier = (value: string) => new TokenIdentifierValue(Buffer.from(value, 'utf-8'));
    static encodeString = (value: string) => BytesValue.fromUTF8(value);
    static encodeAddress = (value: string) => new AddressValue(new Address(value));
    static wrapOptional = (type: OptionalType, value: TypedValue | null) => new OptionalValue(type, value);

    static decodeString = (value: Buffer) => value.toString();
    static decodeAddress = (value: Address) => value.toString();
    static decodeBigNumber = (value: BigNumber) => value.toString();
    static decodeNumber = (value: BigNumber) => value.toNumber();
    static decodeEnum = (value: { name: string }) => value.name;
}


export class Contract extends ContractSerializer {
    protected serializer = new ArgSerializer();
    protected proxy: ProxyProvider;
    protected registry?: AbiRegistry;
    protected abiReady: Promise<void>;

    constructor(
        protected endpoint: string,
        protected contractAddress: string,
        protected contractName: string,
        abiPath: string,
    ) {
        super();
        this.proxy = new ProxyProvider(endpoint);
        this.abiReady = this.loadAbi(abiPath).catch((err) => console.error(`Error loading ABI for ${contractName} contract`, err));
    }

    async query<T, U extends TypedValue>(funcName: string, args: TypedValue[], transform: (decoded: U[]) => T): Promise<T> {
        const query = new Query({
            address: new Address(this.contractAddress),
            func: new ContractFunction(funcName),
            args,
        });

        try {
            const { returnData } = await this.proxy.queryContract(query);
            const decoded = await this.decodeWithAbi(returnData, funcName);
            return transform(decoded as U[]);
        } catch (err) {
            console.error('Unable to call VM query', err);
            throw err;
        }
    }

    async call(funcName: string, value: string, args: TypedValue[], actionName?: string, gasLimit = 60000000) {
        const data = TransactionPayload.contractCall()
            .setFunction(new ContractFunction(funcName))
            .setArgs(args)
            .build()
            .valueOf()
            .toString();
        const transaction: SimpleTransactionType = { receiver: this.contractAddress, value, data, gasLimit };

        await refreshAccount();

        const { sessionId } = await sendTransactions({
            transactions: [transaction],
            transactionsDisplayInfo: {
                processingMessage: `Processing ${actionName ?? ''}`,
                errorMessage: 'An error has occured',
                successMessage: `${actionName ?? ''} successful`
            },
            redirectAfterSign: false
        });

        return sessionId;
    }



    private async loadAbi(abiPath: string) {
        this.registry = (await AbiRegistry.load({ urls: [`${window.location.origin}/${abiPath}`] }));
    }

    private async decodeWithAbi(encoded: string[], endpoint: string) {
        await this.abiReady;

        if (!this.registry) throw new Error('ABI not loaded');

        const definitions = this.registry.getInterface(this.contractName).getEndpoint(endpoint).output;
        return this.serializer.buffersToValues(encoded.map(data => Buffer.from(data, 'base64')), definitions);
    }
}
