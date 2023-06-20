export default `mutation BatchMint($collectionId: BigInt!, $recipients: [MintRecipient!]!, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    BatchMint(
      collectionId: $collectionId
      recipients: $recipients
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
