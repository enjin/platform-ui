export default `mutation CreateCollection($mintPolicy: MintPolicy!, $marketPolicy: MarketPolicy, $multiTokenIdInputs: [MultiTokenIdInput] = [], $attributes: [AttributeInput] = [], $idempotencyKey: String, $skipValidation: Boolean! = false) {
    CreateCollection(
      mintPolicy: $mintPolicy
      marketPolicy: $marketPolicy
      explicitRoyaltyCurrencies: $multiTokenIdInputs
      attributes: $attributes
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
