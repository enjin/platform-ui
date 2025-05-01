export default `mutation RemoveTokenAttribute($collectionId: BigInt!, $tokenId: EncodableTokenIdInput!, $key: String!, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    RemoveTokenAttribute(
      collectionId: $collectionId
      tokenId: $tokenId
      key: $key
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
