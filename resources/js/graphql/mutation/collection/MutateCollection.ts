export default `mutation MutateCollection($collectionId: BigInt!, $mutation: CollectionMutationInput!, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    MutateCollection(
      collectionId: $collectionId
      mutation: $mutation
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
