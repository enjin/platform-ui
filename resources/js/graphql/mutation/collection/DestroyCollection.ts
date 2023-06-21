export default `mutation DestroyCollection($collectionId: BigInt!, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    DestroyCollection(
      collectionId: $collectionId
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
