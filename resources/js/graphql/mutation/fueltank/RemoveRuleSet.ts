export default `mutation RemoveRuleSet($tankId: String!, $ruleSetId: BigInt!, $idempotencyKey: String) {
    RemoveRuleSet(
      tankId: $tankId
      ruleSetId: $ruleSetId
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
