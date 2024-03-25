export default `mutation TransferBalance($recipient: String!, $amount: BigInt!, $keepAlive: Boolean = false, $idempotencyKey: String, $skipValidation: Boolean = false) {
    TransferBalance(
      recipient: $recipient
      amount: $amount
      keepAlive: $keepAlive
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
