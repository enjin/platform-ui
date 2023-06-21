export default `mutation RemoveTokenAttribute($collectionId: BigInt!, $tokenId: EncodableTokenIdInput!, $key: String!, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    RemoveTokenAttribute(
      collectionId: $collectionId
      tokenId: $tokenId
      key: $key
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
