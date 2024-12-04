export default `query GetWallets($first: Int, $after: String, $accounts: [String!]) {
    GetWallets(first: $first, after: $after, accounts: $accounts) {
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
