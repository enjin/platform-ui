export default `mutation Burn($collectionId: BigInt!, $params: BurnParamsInput!, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    Burn(
      collectionId: $collectionId
      params: $params
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
