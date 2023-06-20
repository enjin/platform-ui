export default `mutation ScheduleMutateFreezeState($tankId: String!, $isFrozen: Boolean!, $ruleSetId: BigInt, $idempotencyKey: String) {
    ScheduleMutateFreezeState(
      tankId: $tankId
      isFrozen: $isFrozen
      ruleSetId: $ruleSetId
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
