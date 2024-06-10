export default `query GetSales($ids: [BigInt!], $accounts: [String!], $listingIds: [String!], $after: String = null, $first: Int = 15) {
    GetSales(
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
          amount
          bidder {
            account {
              publicKey
            }
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
