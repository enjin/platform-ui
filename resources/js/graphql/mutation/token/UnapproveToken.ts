export default `mutation UnapproveToken($tokenId: EncodableTokenIdInput!, $collectionId: BigInt!, $operator: String!, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    UnapproveToken(
      tokenId: $tokenId
      collectionId: $collectionId
      operator: $operator
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
