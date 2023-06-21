export default `query GetClaims($ids: [BigInt], $codes: [String], $accounts: [String], $states: [ClaimStatus], $after: String = null, $first: Int = 15) {
    GetClaims(
      ids: $ids
      codes: $codes
      accounts: $accounts
      states: $states
      after: $after
      first: $first
    ) {
      edges {
        node {
          id
          collection {
            collectionId
          }
          tokenId
          quantity
          claimedAt
          claimStatus
          type
          code
          wallet {
            account {
              publicKey
            }
          }
          beam {
            code
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }`;
