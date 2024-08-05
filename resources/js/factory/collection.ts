import { useAppStore } from '~/store';
import { useConnectionStore } from '~/store/connection';
import { FreezeType } from '~/types/types.enums';
import { publicKeyToAddress } from '~/util/address';

export class DTOCollectionFactory {
    public static buildCollection(collection: any) {
        const accounts: string[] = useAppStore().user?.walletAccounts ?? [];
        let tracked = false;

        if (accounts.length && useAppStore().isMultiTenant) {
            tracked = !accounts.find((account) => account === publicKeyToAddress(collection.owner.account.publicKey));
        } else if (useAppStore().config.daemon) {
            tracked = !(useAppStore().config.daemon === publicKeyToAddress(collection.owner.account.publicKey));
        } else if (useConnectionStore().accounts?.length) {
            const accounts = useConnectionStore().accounts.map((account) => publicKeyToAddress(account.address));
            tracked = !accounts.find((account) => account === publicKeyToAddress(collection.owner.account.publicKey));
        }

        return {
            ...collection,
            royalty: {
                percentage: collection.royalty?.percentage,
                beneficiary: publicKeyToAddress(collection.royalty?.beneficiary?.account?.publicKey),
            },
            owner: publicKeyToAddress(collection.owner.account.publicKey),
            freezeType: FreezeType.COLLECTION,
            tracked,
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
