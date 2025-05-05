import { ApiService } from '.';
import mutations from './mutations';
import queries from './queries';

export class MarketplaceApi {
    static async sendPlatfromRequest(data: Record<string, unknown>) {
        return ApiService.sendPlatformRequest(data, '/marketplace');
    }

    static async getListings(getListingsData: Record<string, unknown>) {
        const data = {
            query: queries.GetListings,
            variables: {
                ids: getListingsData.ids,
                listingIds: getListingsData.listingIds,
                account: getListingsData.account,
                makeAssetId: getListingsData.makeAssetId,
                takeAssetId: getListingsData.takeAssetId,
                after: getListingsData.after,
                first: 20,
            },
        };

        return MarketplaceApi.sendPlatfromRequest(data);
    }

    static async getBids(getBidsData: Record<string, unknown>) {
        const data = {
            query: queries.GetBids,
            variables: {
                ids: getBidsData.ids,
                accounts: getBidsData.accounts,
                listingIds: getBidsData.listingIds,
                after: getBidsData.after,
                first: 20,
            },
        };

        return MarketplaceApi.sendPlatfromRequest(data);
    }

    static async getSales(getSalesData: Record<string, unknown>) {
        const data = {
            query: queries.GetSales,
            variables: {
                ids: getSalesData.ids,
                accounts: getSalesData.accounts,
                listingIds: getSalesData.listingIds,
                after: getSalesData.after,
                first: 20,
            },
        };

        return MarketplaceApi.sendPlatfromRequest(data);
    }

    static async createListing(createListingData: Record<string, unknown>) {
        const data = {
            query: mutations.CreateListing,
            variables: {
                makeAssetId: createListingData.makeAssetId,
                takeAssetId: createListingData.takeAssetId,
                amount: createListingData.amount,
                price: createListingData.price,
                salt: createListingData.salt,
                auctionData: createListingData.auctionData,
                signingAccount: createListingData.signingAccount,
                idempotencyKey: createListingData.idempotencyKey,
            },
        };

        return MarketplaceApi.sendPlatfromRequest(data);
    }

    static async cancelListing(cancelListingData: Record<string, unknown>) {
        const data = {
            query: mutations.CancelListing,
            variables: {
                listingId: cancelListingData.listingId,
                idempotencyKey: cancelListingData.idempotencyKey,
                signingAccount: cancelListingData.signingAccount,
            },
        };

        return MarketplaceApi.sendPlatfromRequest(data);
    }

    static async fillListing(fillListingData: Record<string, unknown>) {
        const data = {
            query: mutations.FillListing,
            variables: {
                listingId: fillListingData.listingId,
                amount: fillListingData.amount,
                idempotencyKey: fillListingData.idempotencyKey,
                signingAccount: fillListingData.signingAccount,
            },
        };

        return MarketplaceApi.sendPlatfromRequest(data);
    }

    static async finalizeAuction(finalizeAuctionData: Record<string, unknown>) {
        const data = {
            query: mutations.FinalizeAuction,
            variables: {
                listingId: finalizeAuctionData.listingId,
                idempotencyKey: finalizeAuctionData.idempotencyKey,
                signingAccount: finalizeAuctionData.signingAccount,
            },
        };

        return MarketplaceApi.sendPlatfromRequest(data);
    }

    static async placeBid(placeBidData: Record<string, unknown>) {
        const data = {
            query: mutations.PlaceBid,
            variables: {
                listingId: placeBidData.listingId,
                price: placeBidData.price,
                signingAccount: placeBidData.signingAccount,
                idempotencyKey: placeBidData.idempotencyKey,
            },
        };

        return MarketplaceApi.sendPlatfromRequest(data);
    }

    static async getCurrentBlock() {
        const data = {
            query: queries.GetBlocks,
            variables: {
                first: 1,
            },
        };

        return MarketplaceApi.sendPlatfromRequest(data);
    }
}
