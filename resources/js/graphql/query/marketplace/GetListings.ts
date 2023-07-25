export default `query GetListings($ids: [BigInt!], $listingIds: [String!], $account: String, $makeAssetId: AssetInputType, $takeAssetId: AssetInputType, $after: String = null, $first: Int = 15) {
    GetListings(
      ids: $ids
      listingIds: $listingIds
      account: $account
      makeAssetId: $makeAssetId
      takeAssetId: $takeAssetId
      after: $after
      first: $first
    ) {
      edges {
        node {
          id
          listingId
          makeAssetId {
            collectionId
            tokenId
          }
          takeAssetId {
            collectionId
            tokenId
          }
          amount
          price
          minTakeValue
          creationBlock
          deposit
          salt
          state {
            __typename
          }
          data {
            __typename
          }
          seller {
            account {
                publicKey
            }
          }
          sales {
            totalCount
          }
          bids {
            totalCount
          }
          states {
            id
            state
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }`;
