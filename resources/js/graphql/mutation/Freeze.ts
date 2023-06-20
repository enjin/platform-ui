export default `mutation Freeze($freezeType: FreezeType!, $collectionId: BigInt!, $tokenId: EncodableTokenIdInput, $collectionAccount: String, $tokenAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    Freeze(
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
