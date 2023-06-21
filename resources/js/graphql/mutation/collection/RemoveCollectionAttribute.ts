export default `mutation RemoveCollectionAttribute($collectionId: BigInt!, $key: String!, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    RemoveCollectionAttribute(
      collectionId: $collectionId
      key: $key
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
