export default `mutation UnapproveToken($tokenId: EncodableTokenIdInput!, $collectionId: BigInt!, $operator: String!, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    UnapproveToken(
      tokenId: $tokenId
      collectionId: $collectionId
      operator: $operator
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
