export default `query GetBids($ids: [BigInt!], $accounts: [String!], $listingIds: [String!], $after: String = null, $first: Int = 15) {
    GetBids(
      ids: $ids
      accounts: $accounts
      listingIds: $listingIds
      after: $after
      first: $first
    ) {
      edges {
        node {
          id
          price
          height
          bidder {
            account {
                publicKey
            }
          }
          listing {
            listingId
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
