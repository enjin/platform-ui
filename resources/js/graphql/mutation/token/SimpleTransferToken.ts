export default `mutation SimpleTransferToken($collectionId: BigInt!, $recipient: String!, $params: SimpleTransferParams!, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    SimpleTransferToken(
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
