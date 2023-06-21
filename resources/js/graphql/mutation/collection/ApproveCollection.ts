export default `mutation ApproveCollection($collectionId: BigInt!, $operator: String!, $expiration: Int = null, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    ApproveCollection(
      collectionId: $collectionId
      operator: $operator
      expiration: $expiration
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
