export default `mutation ApproveToken($tokenId: EncodableTokenIdInput!, $collectionId: BigInt!, $operator: String!, $amount: BigInt!, $currentAmount: BigInt!, $expiration: Int = null, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    ApproveToken(
      tokenId: $tokenId
      collectionId: $collectionId
      operator: $operator
      amount: $amount
      currentAmount: $currentAmount
      expiration: $expiration
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
