import { publicKeyToAddress } from '~/util/address';

export class DTOAccountFactory {
    public static buildAccount(account: any): any {
        return {
            ...account,
            account: publicKeyToAddress(account.account.publicKey),
        };
    }

    public static forAccounts(accountsData: any): any {
        const accounts = accountsData.data.GetAccounts;

        return {
            items: accounts?.edges?.map((account) => DTOAccountFactory.buildAccount(account.node)),
            cursor: accounts.pageInfo?.hasNextPage ? accounts.pageInfo.endCursor : null,
        };
    }

    public static forAccount(accountData: any): any {
        const account = accountData.data.Getaccount;

        return {
            items: [DTOAccountFactory.buildAccount(account)],
            cursor: null,
        };
    }
}
