export default `mutation InsertRuleSet($tankId: String!, $ruleSetId: BigInt!, $dispatchRules: [DispatchRuleInputType!], $idempotencyKey: String) {
    InsertRuleSet(
      tankId: $tankId
      ruleSetId: $ruleSetId
      dispatchRules: $dispatchRules
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
