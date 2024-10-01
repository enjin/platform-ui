import { FreezeType } from '~/types/types.enums';
import { publicKeyToAddress } from '~/util/address';

export class DTOCollectionFactory {
    public static buildCollection(collection: any) {
        return {
            ...collection,
            royalty: {
                percentage: collection.royalty?.percentage,
                beneficiary: publicKeyToAddress(collection.royalty?.beneficiary?.account?.publicKey),
            },
            owner: publicKeyToAddress(collection.owner.account.publicKey),
            freezeType: FreezeType.COLLECTION,
        };
    }

    public static forCollections(collectionsData: any) {
        const collections = collectionsData.data.GetCollections;

        return {
            items: collections?.edges?.map((collection) => {
                return DTOCollectionFactory.buildCollection(collection.node);
            }),
            cursor: collections.pageInfo?.hasNextPage ? collections.pageInfo.endCursor : null,
        };
    }

    public static forCollection(collectionData: any) {
        const collection = collectionData.data.GetCollection;

        return {
            items: [DTOCollectionFactory.buildCollection(collection)],
            cursor: null,
        };
    }
}
