export default `mutation MutateToken($collectionId: BigInt!, $tokenId: EncodableTokenIdInput!, $mutation: TokenMutationInput!, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    MutateToken(
      collectionId: $collectionId
      tokenId: $tokenId
      mutation: $mutation
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
