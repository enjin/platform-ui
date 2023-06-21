export default `mutation UnapproveCollection($collectionId: BigInt!, $operator: String!, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    UnapproveCollection(
      collectionId: $collectionId
      operator: $operator
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
