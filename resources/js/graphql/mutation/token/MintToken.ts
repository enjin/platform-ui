export default `mutation MintToken($collectionId: BigInt!, $recipient: String!, $params: MintTokenParams!, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    MintToken(
      collectionId: $collectionId
      recipient: $recipient
      params: $params
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
