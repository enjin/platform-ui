import { publicKeyToAddress } from '~/util/address';

export class DTOWalletFactory {
    public static buildWallet(wallet: any): any {
        return {
            ...wallet,
            account: publicKeyToAddress(wallet?.account?.publicKey),
        };
    }

    public static forWallets(walletsData: any): any {
        const wallets = walletsData.data.GetWallets;

        return {
            items: wallets?.edges?.map((wallet) => DTOWalletFactory.buildWallet(wallet.node)),
            cursor: wallets.pageInfo?.hasNextPage ? wallets.pageInfo.endCursor : null,
        };
    }

    public static forWallet(walletData: any): any {
        const wallet = walletData.data.GetWallet;
        if (!wallet) {
            return {
                items: [],
                cursor: null,
            };
        }

        return {
            items: [DTOWalletFactory.buildWallet(wallet)],
            cursor: null,
        };
    }
}
