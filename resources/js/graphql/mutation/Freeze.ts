export default `mutation Freeze($freezeType: FreezeType!, $collectionId: BigInt!, $freezeState: FreezeStateType, $tokenId: EncodableTokenIdInput, $collectionAccount: String, $tokenAccount: String, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    Freeze(
      freezeType: $freezeType
      collectionId: $collectionId
      tokenId: $tokenId
      freezeState: $freezeState
      collectionAccount: $collectionAccount
      tokenAccount: $tokenAccount
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
