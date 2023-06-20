export default `mutation SetCollectionAttribute($collectionId: BigInt!, $key: String!, $value: String!, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    SetCollectionAttribute(
      collectionId: $collectionId
      key: $key
      value: $value
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
