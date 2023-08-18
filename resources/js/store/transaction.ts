import { ApiPromise, WsProvider } from '@polkadot/api';
import { defineStore } from 'pinia';
import { TransactionState } from '~/types/types.interface';
import { useAppStore } from '.';
import { TransactionApi } from '~/api/transaction';
import { formatData, snackbarErrors } from '~/util';
import snackbar from '~/util/snackbar';
import { SignerPayloadJSON } from '@polkadot/types/types';

const RPC_URLS = {
    canary: 'wss://rpc.matrix.canary.enjin.io',
    polkadot: 'wss://rpc.efinity.io',
};

export const useTransactionStore = defineStore('transaction', {
    state: (): TransactionState => ({
        api: null,
    }),
    actions: {
        async init() {
            const provider = new WsProvider(RPC_URLS[useAppStore().config.network]);
            const api = await ApiPromise.create({ provider });
            console.log(api)
        },
        async getExtrinsicData(transaction: any, address: string) {
            console.log('here');
            console.log(address);
            const [genesisHash, currentBlock, runtime, account] = await Promise.all([
                this.api.rpc.chain.getBlockHash(0),
                this.api.rpc.chain.getBlock(),
                this.api.rpc.state.getRuntimeVersion(),
                // @ts-ignore
                <AccountInfoWithTripleRefCount>this.api.query.system.account(address),
            ]);

            // This is the call that comes from the platform transactions 'encodedCall'
            const call = transaction.encodedData;
            const era = '00'; // 00 is for immortal transactions
            const genesis = genesisHash.toHex(); // The genesis block
            const blockHash = genesisHash.toHex(); // For immortal transactions the blockhash needs to be the genesis

            const payloadToSign: SignerPayloadJSON = {
                specVersion: runtime.specVersion.toString(),
                transactionVersion: runtime.transactionVersion.toString(),
                address: address,
                blockHash: blockHash,
                blockNumber: '0x00',
                era: '0x' + era,
                genesisHash: genesis,
                method: call,
                nonce: account.nonce.toHex(),
                signedExtensions: this.api.registry.signedExtensions,
                tip: '0x00',
                version: 4,
            };

            const extrinsic = this.api.registry.createType(
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
            const { extrinsic } = await this.getExtrinsicData(transaction, useAppStore().accounts[0].address);
            console.log('here 1');

            const paymentInfo = await this.api.tx[extrinsic.method.section]
                [extrinsic.method.method](...extrinsic.method.args)
                .paymentInfo(useAppStore().accounts[0].address);

            console.log('here 2');
            return paymentInfo.partialFee.toHuman();
        },
        async signTransaction(transaction: any) {
            const { extrinsic, payloadToSign, currentBlock } = await this.getExtrinsicData(
                transaction,
                useAppStore().account.address
            );

            const { signature } = await useAppStore().account.signer.signPayload(payloadToSign);

            extrinsic.addSignature(useAppStore().account.address, signature, payloadToSign);

            const transactionHash = await this.api.rpc.author.submitExtrinsic(extrinsic.toHex());

            return await this.updateTransaction({
                id: transaction.id,
                transactionHash: transactionHash.toHex(),
                signingAccount: useAppStore().account.address,
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