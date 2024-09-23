import { ApiService } from '.';
import mutations from './mutations';
import queries from './queries';

export class CollectionApi {
    static async getCollections(after: string | null = null) {
        const data = {
            query: queries.GetCollections,
            variables: {
                after: after,
                first: 20,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async getCollectionsIds(first: number = 20, after?: string) {
        const data = {
            query: queries.GetCollectionIds,
            variables: {
                first,
                after,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async getCollection(collectionId: string) {
        const data = {
            query: queries.GetCollection,
            variables: {
                collectionId,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async createCollection(collectionData: Record<string, unknown>) {
        const data = {
            query: mutations.CreateCollection,
            variables: {
                mintPolicy: collectionData.mintPolicy,
                marketPolicy: collectionData.marketPolicy ? { royalty: collectionData.marketPolicy } : null,
                explicitRoyaltyCurrencies: collectionData.explicitRoyaltyCurrencies,
                attributes: collectionData.attributes,
                idempotencyKey: collectionData.idempotencyKey,
                skipValidation: collectionData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async approveCollection(collectionData: Record<string, unknown>) {
        const data = {
            query: mutations.ApproveCollection,
            variables: {
                collectionId: collectionData.collectionId,
                operator: collectionData.operator,
                expiration: collectionData.expiration,
                idempotencyKey: collectionData.idempotencyKey,
                skipValidation: collectionData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async unapproveCollection(collectionData: Record<string, unknown>) {
        const data = {
            query: mutations.UnapproveCollection,
            variables: {
                collectionId: collectionData.collectionId,
                operator: collectionData.operator,
                idempotencyKey: collectionData.idempotencyKey,
                skipValidation: collectionData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async destroyCollection(collectionData: Record<string, unknown>) {
        const data = {
            query: mutations.DestroyCollection,
            variables: {
                collectionId: collectionData.collectionId,
                idempotencyKey: collectionData.idempotencyKey,
                skipValidation: collectionData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async mutateCollection(collectionData: Record<string, unknown>) {
        const data = {
            query: mutations.MutateCollection,
            variables: {
                collectionId: collectionData.collectionId,
                mutation: collectionData.mutation,
                idempotencyKey: collectionData.idempotencyKey,
                skipValidation: collectionData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async setCollectionAttribute(setCollectionAttributeData: Record<string, unknown>) {
        const data = {
            query: mutations.SetCollectionAttribute,
            variables: {
                collectionId: setCollectionAttributeData.collectionId,
                key: setCollectionAttributeData.key,
                value: setCollectionAttributeData.value,
                idempotencyKey: setCollectionAttributeData.idempotencyKey,
                skipValidation: setCollectionAttributeData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async removeCollectionAttribute(removeCollectionAttributeData: Record<string, unknown>) {
        const data = {
            query: mutations.RemoveCollectionAttribute,
            variables: {
                collectionId: removeCollectionAttributeData.collectionId,
                key: removeCollectionAttributeData.key,
                idempotencyKey: removeCollectionAttributeData.idempotencyKey,
                skipValidation: removeCollectionAttributeData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async removeAllAttributes(removeAllAttributesData: Record<string, unknown>) {
        const variables = {
            collectionId: removeAllAttributesData.collectionId,
            attributeCount: removeAllAttributesData.attributeCount,
            idempotencyKey: removeAllAttributesData.idempotencyKey,
            skipValidation: removeAllAttributesData.skipValidation,
        };

        if (removeAllAttributesData.tokenId) {
            variables['tokenId'] = removeAllAttributesData.tokenId;
        }

        const data = {
            query: mutations.RemoveAllAttributes,
            variables,
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async trackCollection(collectionId: string) {
        const data = {
            query: mutations.TrackCollection,
            variables: {
                chainIds: [parseInt(collectionId)],
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async untrackCollection(collectionId: string) {
        const data = {
            query: mutations.UntrackCollection,
            variables: {
                chainIds: [parseInt(collectionId)],
            },
        };

        return ApiService.sendPlatformRequest(data);
    }
}
