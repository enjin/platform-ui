export default `mutation TransferAllowDeath($recipient: String!, $amount: BigInt!, $signingAccount: String, $idempotencyKey: String, $skipValidation: Boolean = false) {
    TransferAllowDeath(
      recipient: $recipient
      amount: $amount
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
      skipValidation: $skipValidation
    ) {
      id
    }
}`;
