export default `mutation InfuseToken($collectionId: BigInt!, $tokenId: EncodableTokenIdInput!, $amount: BigInt!, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    InfuseToken(
      collectionId: $collectionId
      tokenId: $tokenId
      amount: $amount
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
