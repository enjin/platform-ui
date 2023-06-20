export default `mutation OperatorTransferToken($collectionId: BigInt!, $recipient: String!, $params: OperatorTransferParams!, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    OperatorTransferToken(
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
