export default `mutation BatchTransfer($collectionId: BigInt!, $recipients: [TransferRecipient!]!, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean! = false) {
    BatchTransfer(
      collectionId: $collectionId
      recipients: $recipients
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
