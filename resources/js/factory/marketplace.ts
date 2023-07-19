export class DTOMarketplaceFactory {
    public static buildBid(bid: any): any {
        return {
            ...bid,
            bidder: bid.bidder.account.publicKey,
        };
    }

    public static buildListing(listing: any): any {
        return {
            ...listing,
            seller: listing.seller.account.publicKey,
            sales: listing.sales.totalCount,
            bids: listing.bids.totalCount,
        };
    }

    public static buildSale(sale: any): any {
        return {
            ...sale,
            bidder: sale.bidder.account.publicKey,
        };
    }

    public static forBids(bidsData: any): any {
        const bids = bidsData.data.GetBids;

        return {
            items: bids?.edges?.map((item) => DTOMarketplaceFactory.buildBid(item.node)),
            cursor: bids.pageInfo?.hasNextPage ? bids.pageInfo.endCursor : null,
            totalCount: bids.totalCount,
        };
    }

    public static forListings(listingData: any): any {
        const listings = listingData.data.GetListings;

        return {
            items: listings?.edges?.map((item) => DTOMarketplaceFactory.buildListing(item.node)),
            cursor: listings.pageInfo?.hasNextPage ? listings.pageInfo.endCursor : null,
            totalCount: listings.totalCount,
        };
    }

    public static forSales(saleData: any): any {
        const sales = saleData.data.GetSales;

        return {
            items: sales?.edges?.map((item) => DTOMarketplaceFactory.buildSale(item.node)),
            cursor: sales.pageInfo?.hasNextPage ? sales.pageInfo.endCursor : null,
            totalCount: sales.totalCount,
        };
    }
}
