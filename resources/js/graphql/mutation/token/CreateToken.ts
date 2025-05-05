export default `mutation CreateToken($collectionId: BigInt!, $recipient: String!, $params: CreateTokenParams!, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    CreateToken(
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
