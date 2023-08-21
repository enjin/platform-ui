export class DTOTransactionFactory {
    public static buildTransaction(transaction: any): any {
        return {
            ...transaction,
            result: transaction.result?.replace('EXTRINSIC', 'TRANSACTION'),
            wallet: transaction.wallet?.account?.publicKey,
            events: transaction.events?.edges
                ?.filter((event) => !['Balances', 'System', 'TransactionPayment'].includes(event.node.moduleId))
                .map((event) => event.node),
            advancedEvents: transaction.events?.edges
                ?.filter((event) => ['Balances', 'TransactionPayment'].includes(event.node.moduleId))
                .map((event) => event.node),
        };
    }

    public static forTransactions(transactionsData: any): any {
        const transactions = transactionsData.data.GetTransactions;

        return {
            items: transactions?.edges?.map((transaction) => DTOTransactionFactory.buildTransaction(transaction.node)),
            cursor: transactions.pageInfo?.hasNextPage ? transactions.pageInfo.endCursor : null,
        };
    }

    public static forTransaction(transactionData: any): any {
        const transaction = transactionData.data.GetTransaction;

        return DTOTransactionFactory.buildTransaction(transaction);
    }
}
