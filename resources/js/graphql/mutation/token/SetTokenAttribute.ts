export default `mutation SetTokenAttribute($collectionId: BigInt!, $tokenId: EncodableTokenIdInput!, $key: String!, $value: String!, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    SetTokenAttribute(
      collectionId: $collectionId
      tokenId: $tokenId
      key: $key
      value: $value
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
