import { ApiPromise, WsProvider } from '@polkadot/api';
import { defineStore } from 'pinia';
import { TransactionState } from '~/types/types.interface';
import { useAppStore } from '.';
import { TransactionApi } from '~/api/transaction';
import { formatData, snackbarErrors } from '~/util';
import snackbar from '~/util/snackbar';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { markRaw } from 'vue';
import { AccountInfoWithTripleRefCount } from '@polkadot/types/interfaces';
import { useConnectionStore } from './connection';
import { GenericExtrinsicEra } from '@polkadot/types';

const RPC_URLS = {
    canary: 'wss://rpc.matrix.canary.enjin.io',
    enjin: 'wss://rpc.matrix.blockchain.enjin.io',
};

export const useTransactionStore = defineStore('transaction', {
    state: (): TransactionState => ({
        api: null,
    }),
    actions: {
        async init() {
            if (this.api) {
                return;
            }

            const provider = new WsProvider(RPC_URLS[useAppStore().config.network]);
            const api = await ApiPromise.create({ provider });
            this.api = markRaw(api);
        },
        async getExtrinsicData(transaction: any, address: string, api: any) {
            const [genesisHash, currentBlock, runtime, account] = await Promise.all([
                api.rpc.chain.getBlockHash(0),
                api.rpc.chain.getBlock(),
                api.rpc.state.getRuntimeVersion(),
                <AccountInfoWithTripleRefCount>api.query.system.account(address),
            ]);

            const blockNumber = currentBlock.block.header.number;
            const blockHash = await api.rpc.chain.getBlockHash(blockNumber.toNumber());

            // This is the call that comes from the platform transactions 'encodedCall'
            const call = transaction.encodedData;
            const genesis = genesisHash.toHex(); // The genesis block
            const mortalEra = new GenericExtrinsicEra(api.registry, { current: blockNumber.toNumber(), period: 64 });
            const metadataHash =
                transaction.signingPayloadJson.metadataHash === '00'
                    ? '0x0000000000000000000000000000000000000000000000000000000000000000'
                    : transaction.signingPayloadJson.metadataHash;

            const payloadToSign: SignerPayloadJSON = {
                specVersion: runtime.specVersion.toHex(),
                transactionVersion: runtime.transactionVersion.toHex(),
                address: address,
                blockHash: blockHash.toHex(),
                blockNumber: blockNumber.toHex(),
                era: mortalEra.toHex(),
                genesisHash: genesis,
                method: call,
                nonce: account.nonce.toHex(),
                signedExtensions: api.registry.signedExtensions,
                tip: '0x00',
                version: 4,
                metadataHash: metadataHash,
                mode: transaction.signingPayloadJson.mode,
            };

            const extrinsic = api.registry.createType(
                'Extrinsic',
                { method: payloadToSign.method },
                { version: payloadToSign.version }
            );

            return {
                extrinsic,
                payloadToSign,
                currentBlock,
            };
        },
        async getTransactionCost(transaction: any) {
            const { extrinsic } = await this.getExtrinsicData(
                transaction,
                useConnectionStore().accounts[0].address,
                this.api
            );

            const paymentInfo = await this.api.tx[extrinsic.method.section]
                [extrinsic.method.method](...extrinsic.method.args)
                .paymentInfo(useConnectionStore().accounts[0].address);

            return paymentInfo.partialFee.toHuman();
        },
        async signTransaction(transaction: any) {
            const { extrinsic, payloadToSign, currentBlock } = await this.getExtrinsicData(
                transaction,
                useConnectionStore().account.address,
                this.api
            );

            const { signature } = await useConnectionStore().account.signer.signPayload(payloadToSign);

            extrinsic.addSignature(useConnectionStore().account.address, signature, payloadToSign);

            const transactionHash = await this.api.rpc.author.submitExtrinsic(extrinsic.toHex());

            return await this.updateTransaction({
                id: transaction.id,
                transactionHash: transactionHash.toHex(),
                signingAccount: useConnectionStore().account.address,
                signedAtBlock: currentBlock.block.header.number.toNumber(),
            });
        },
        async updateTransaction({
            id,
            transactionHash,
            signingAccount,
            signedAtBlock,
        }: {
            id: string;
            transactionHash: string;
            signingAccount: string;
            signedAtBlock: number;
        }) {
            try {
                const res = await TransactionApi.updateTransaction(
                    formatData({
                        id: id,
                        transactionHash: transactionHash,
                        state: 'BROADCAST',
                        signingAccount: signingAccount,
                        signedAtBlock: signedAtBlock,
                    })
                );

                const updated = res.data?.UpdateTransaction;

                if (updated) {
                    snackbar.success({
                        title: 'Transaction signed',
                        text: `The transaction was signed successfully`,
                    });

                    return true;
                }

                snackbar.error({
                    title: 'Sign Transaction',
                    text: 'Signing transaction failed',
                });

                return false;
            } catch (e) {
                if (snackbarErrors(e)) return;
                snackbar.error({
                    title: 'Sign Transaction',
                    text: 'Signing transaction failed',
                });
            }
        },
    },
});
