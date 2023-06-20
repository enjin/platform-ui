export default `mutation MintToken($collectionId: BigInt!, $recipient: String!, $params: MintTokenParams!, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    MintToken(
      collectionId: $collectionId
      recipient: $recipient
      params: $params
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
