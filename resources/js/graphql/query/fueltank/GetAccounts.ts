export default `query GetAccounts($tankId: String!, $after: String = null, $first: Int = 15) {
    GetAccounts( tankId: $tankId, after: $after, first: $first) {
      edges {
        node {
          id
          account {
            publicKey
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }`;
