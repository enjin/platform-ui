export default `mutation ApproveToken($tokenId: EncodableTokenIdInput!, $collectionId: BigInt!, $operator: String!, $amount: BigInt!, $currentAmount: BigInt!, $expiration: Int = null, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    ApproveToken(
      tokenId: $tokenId
      collectionId: $collectionId
      operator: $operator
      amount: $amount
      currentAmount: $currentAmount
      expiration: $expiration
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
