import { ApiService } from '.';
import mutations from './mutations';
import queries from './queries';

export class MarketplaceApi {
    static async sendPlatfromRequest(data: Record<string, unknown>) {
        return ApiService.sendPlatfromRequest(data, '/marketplace');
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
}
