export default `query GetTransactions($idempotencyKeys: [String], $ids: [BigInt!], $transactionIds: [String], $transactionHashes: [String], $methods: [TransactionMethod], $states: [TransactionState], $results: [TransactionResult], $accounts: [String], $after: String = null, $first: Int = 15) {
    GetTransactions(
      ids: $ids
      idempotencyKeys: $idempotencyKeys
      transactionIds: $transactionIds
      transactionHashes: $transactionHashes
      methods: $methods
      states: $states
      results: $results
      accounts: $accounts
      after: $after
      first: $first
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          wallet {
            account {
              publicKey
            }
          }
          transactionHash
          method
          result
          state
          transactionId
          events {
            edges {
              node {
                moduleId
                eventId
                params {
                  type
                  value
                }
              }
            }
          }
        }
        cursor
      }
    }
  }`;
