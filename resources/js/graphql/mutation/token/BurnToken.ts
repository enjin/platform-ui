export default `mutation Burn($collectionId: BigInt!, $params: BurnParamsInput!, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    Burn(
      collectionId: $collectionId
      params: $params
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
