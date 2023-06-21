export default `mutation RemoveAccountRuleData($tankId: String!, $userId: String!, $ruleSetId: BigInt!, $rule: DispatchRuleEnum!, $idempotencyKey: String) {
    RemoveAccountRuleData(
      tankId: $tankId
      userId: $userId
      ruleSetId: $ruleSetId
      rule: $rule
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
