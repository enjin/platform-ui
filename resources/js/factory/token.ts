import { FreezeType } from '~/types/types.enums';
import { publicKeyToAddress } from '~/util/address';

export class DTOTokenFactory {
    public static buildToken(token: any): any {
        return {
            ...token,
            royalty: {
                percentage: token.royalty?.percentage,
                beneficiary: publicKeyToAddress(token.royalty?.beneficiary?.account?.publicKey),
            },
            owner:
                token.accounts.totalCount === 1
                    ? publicKeyToAddress(token.accounts.edges[0].node.wallet.account.publicKey)
                    : null,
            collectionId: token.collection.collectionId,
            freezeType: FreezeType.TOKEN,
        };
    }

    public static forTokens(tokensData: any): any {
        const tokens = tokensData.data.GetTokens;

        return {
            items: tokens?.edges?.map((token) => DTOTokenFactory.buildToken(token.node)),
            cursor: tokens.pageInfo?.hasNextPage ? tokens.pageInfo.endCursor : null,
        };
    }

    public static forToken(tokenData: any): any {
        const token = tokenData.data.GetToken;

        return {
            items: [DTOTokenFactory.buildToken(token)],
            cursor: null,
        };
    }
}
