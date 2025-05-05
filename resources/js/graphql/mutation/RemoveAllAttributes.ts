export default `mutation RemoveAllAttributes($collectionId: BigInt!, $tokenId: EncodableTokenIdInput, $attributeCount: Int, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    RemoveAllAttributes(
      collectionId: $collectionId
      tokenId: $tokenId
      attributeCount: $attributeCount
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
