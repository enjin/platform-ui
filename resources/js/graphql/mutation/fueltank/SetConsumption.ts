export default `mutation SetConsumption($tankId: String!, $ruleSetId: BigInt!, $userId: String, $totalConsumed: BigInt!, $lastResetBlock: Int, $idempotencyKey: String) {
    SetConsumption(
      tankId: $tankId
      ruleSetId: $ruleSetId
      userId: $userId
      totalConsumed: $totalConsumed
      lastResetBlock: $lastResetBlock
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
