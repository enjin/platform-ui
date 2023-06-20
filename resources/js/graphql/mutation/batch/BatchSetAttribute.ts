export default `mutation BatchSetAttribute($collectionId: BigInt!, $attributes: [AttributeInput!]!, $tokenId: EncodableTokenIdInput, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    BatchSetAttribute(
      collectionId: $collectionId
      attributes: $attributes
      tokenId: $tokenId
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
