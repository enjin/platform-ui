export default `mutation Thaw($freezeType: FreezeType!, $collectionId: BigInt!, $tokenId: EncodableTokenIdInput, $collectionAccount: String, $tokenAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    Thaw(
      freezeType: $freezeType
      collectionId: $collectionId
      tokenId: $tokenId
      collectionAccount: $collectionAccount
      tokenAccount: $tokenAccount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
