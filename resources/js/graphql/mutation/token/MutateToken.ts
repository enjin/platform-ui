export default `mutation MutateToken($collectionId: BigInt!, $tokenId: EncodableTokenIdInput!, $mutation: TokenMutationInput!, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    MutateToken(
      collectionId: $collectionId
      tokenId: $tokenId
      mutation: $mutation
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
