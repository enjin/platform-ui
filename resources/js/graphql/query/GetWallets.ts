export default `query GetWallets($first: Int, $after: String) {
    GetWallets(first: $first, after: $after) {
      edges {
        node {
          id
          account {
            publicKey
          }
          externalId
          balances {
            free
            reserved
          }
          managed
          network
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
