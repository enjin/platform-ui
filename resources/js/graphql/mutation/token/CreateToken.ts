export default `mutation CreateToken($collectionId: BigInt!, $recipient: String!, $params: CreateTokenParams!, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    CreateToken(
      collectionId: $collectionId
      recipient: $recipient
      params: $params
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
