export default `mutation TransferBalance($recipient: String!, $amount: BigInt!, $signingAccount: String, $keepAlive: Boolean = false, $idempotencyKey: String, $skipValidation: Boolean = false) {
    TransferBalance(
      recipient: $recipient
      amount: $amount
      signingAccount: $signingAccount
      keepAlive: $keepAlive
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
