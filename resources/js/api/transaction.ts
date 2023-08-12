import { ApiService } from '.';
import mutations from './mutations';
import queries from './queries';

export class TransactionApi {
    static async getTransaction(transactionId: string) {
        const data = {
            query: queries.GetTransaction,
            variables: {
                id: transactionId,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async getTransactions(getTransactionsData: Record<string, unknown>) {
        const data = {
            query: queries.GetTransactions,
            variables: {
                ids: getTransactionsData.ids,
                idempotencyKeys: getTransactionsData.idempotencyKeys,
                transactionIds: getTransactionsData.transactionIds,
                transactionHashes: getTransactionsData.transactionHashes,
                methods: getTransactionsData.methods,
                states: getTransactionsData.states,
                results: getTransactionsData.results,
                accounts: getTransactionsData.accounts,
                after: getTransactionsData.after,
                first: 20,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async getWallet(walletData: Record<string, unknown>) {
        const data = {
            query: queries.GetWallet,
            variables: {
                id: walletData.id,
                externalId: walletData.externalId,
                verificationId: walletData.verificationId,
                account: walletData.account,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async retryTransactions(retryTransactionsData: Record<string, unknown>) {
        const data = {
            query: mutations.RetryTransactions,
            variables: {
                ids: retryTransactionsData.ids,
                idempotencyKeys: retryTransactionsData.idempotencyKeys,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async updateTransaction(updateTransactionData: Record<string, unknown>) {
        const data = {
            query: mutations.UpdateTransaction,
            variables: {
                id: updateTransactionData.id,
                state: updateTransactionData.state,
                transactionId: updateTransactionData.transactionId,
                transactionHash: updateTransactionData.transactionHash,
                signingAccount: updateTransactionData.signingAccount,
                signedAtBlock: updateTransactionData.signedAtBlock,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }
}
