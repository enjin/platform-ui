import { TransferType } from '~/types/types.enums';
import { ApiService } from '.';
import mutations from './mutations';
import queries from './queries';

export class TokenApi {
    static async getTokens(collectionId: string, tokens: any, after: string | null = null) {
        const data = {
            query: queries.GetTokens,
            variables: {
                collectionId,
                tokenIds: tokens,
                after,
                first: 20,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async approveToken(tokenData: Record<string, unknown>) {
        const data = {
            query: mutations.ApproveToken,
            variables: {
                tokenId: tokenData.tokenId,
                collectionId: tokenData.collectionId,
                operator: tokenData.operator,
                amount: tokenData.amount,
                currentAmount: tokenData.currentAmount,
                expiration: tokenData.expiration,
                signingAccount: tokenData.signingAccount,
                idempotencyKey: tokenData.idempotencyKey,
                skipValidation: tokenData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async unapproveToken(tokenData: Record<string, unknown>) {
        const data = {
            query: mutations.UnapproveToken,
            variables: {
                tokenId: tokenData.tokenId,
                collectionId: tokenData.collectionId,
                operator: tokenData.operator,
                signingAccount: tokenData.signingAccount,
                idempotencyKey: tokenData.idempotencyKey,
                skipValidation: tokenData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async burnToken(tokenData: Record<string, unknown>) {
        const data = {
            query: mutations.BurnToken,
            variables: {
                collectionId: tokenData.collectionId,
                params: {
                    tokenId: tokenData.tokenId,
                    amount: tokenData.amount,
                    keepAlive: tokenData.keepAlive,
                    removeTokenStorage: tokenData.removeTokenStorage,
                },
                signingAccount: tokenData.signingAccount,
                idempotencyKey: tokenData.idempotencyKey,
                skipValidation: tokenData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async mutateToken(tokenData: Record<string, unknown>) {
        const data = {
            query: mutations.MutateToken,
            variables: {
                collectionId: tokenData.collectionId,
                tokenId: tokenData.tokenId,
                mutation: {
                    behavior: {
                        hasRoyalty: tokenData.hasRoyalty,
                        isCurrency: tokenData.isCurrency,
                    },
                    listingForbidden: tokenData.listingForbidden,
                },
                signingAccount: tokenData.signingAccount,
                idempotencyKey: tokenData.idempotencyKey,
                skipValidation: tokenData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async transferToken(tokenData: Record<string, unknown>) {
        const query = mutations[tokenData.transferType as TransferType];

        const params: any = tokenData.params;

        const data = {
            query,
            variables: {
                collectionId: tokenData.collectionId,
                recipient: tokenData.recipient,
                params,
                signingAccount: tokenData.signingAccount,
                idempotencyKey: tokenData.idempotencyKey,
                skipValidation: tokenData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async createToken(tokenData: Record<string, unknown>) {
        const data = {
            query: mutations.CreateToken,
            variables: {
                collectionId: tokenData.collectionId,
                recipient: tokenData.recipient,
                params: tokenData.params,
                signingAccount: tokenData.signingAccount,
                idempotencyKey: tokenData.idempotencyKey,
                skipValidation: tokenData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async mintToken(tokenData: Record<string, unknown>) {
        const data = {
            query: mutations.MintToken,
            variables: {
                collectionId: tokenData.collectionId,
                recipient: tokenData.recipient,
                params: tokenData.params,
                signingAccount: tokenData.signingAccount,
                idempotencyKey: tokenData.idempotencyKey,
                skipValidation: tokenData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async setTokenAttribute(setTokenAttributeData: Record<string, unknown>) {
        const data = {
            query: mutations.SetTokenAttribute,
            variables: {
                collectionId: setTokenAttributeData.collectionId,
                tokenId: setTokenAttributeData.tokenId,
                key: setTokenAttributeData.key,
                value: setTokenAttributeData.value,
                signingAccount: setTokenAttributeData.signingAccount,
                idempotencyKey: setTokenAttributeData.idempotencyKey,
                skipValidation: setTokenAttributeData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async removeTokenAttribute(removeTokenAttributeData: Record<string, unknown>) {
        const data = {
            query: mutations.RemoveTokenAttribute,
            variables: {
                collectionId: removeTokenAttributeData.collectionId,
                tokenId: removeTokenAttributeData.tokenId,
                key: removeTokenAttributeData.key,
                signingAccount: removeTokenAttributeData.signingAccount,
                idempotencyKey: removeTokenAttributeData.idempotencyKey,
                skipValidation: removeTokenAttributeData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async removeAllAttributes(removeAllAttributesData: Record<string, unknown>) {
        const data = {
            query: mutations.RemoveAllAttributes,
            variables: {
                collectionId: removeAllAttributesData.collectionId,
                tokenId: removeAllAttributesData.tokenId,
                attributeCount: removeAllAttributesData.attributeCount,
                signingAccount: removeAllAttributesData.signingAccount,
                idempotencyKey: removeAllAttributesData.idempotencyKey,
                skipValidation: removeAllAttributesData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async infuseToken(infuseTokenData: Record<string, unknown>) {
        const data = {
            query: mutations.InfuseToken,
            variables: {
                collectionId: infuseTokenData.collectionId,
                tokenId: infuseTokenData.tokenId,
                amount: infuseTokenData.amount,
                signingAccount: infuseTokenData.signingAccount,
                idempotencyKey: infuseTokenData.idempotencyKey,
                skipValidation: infuseTokenData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }
}
