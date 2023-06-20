export default `mutation RemoveAllAttributes($collectionId: BigInt!, $tokenId: EncodableTokenIdInput, $attributeCount: Int, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    RemoveAllAttributes(
      collectionId: $collectionId
      tokenId: $tokenId
      attributeCount: $attributeCount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
