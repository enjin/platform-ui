export default `mutation RetryTransactions($ids: [BigInt!], $idempotencyKeys: [String!]) {
    RetryTransactions(ids: $ids, idempotencyKeys: $idempotencyKeys)
  }`;
