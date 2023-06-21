export default `mutation Dispatch($tankId: String!, $ruleSetId: BigInt!, $dispatch: DispatchInputType!, $paysRemainingFee: Boolean = false, $idempotencyKey: String) {
    Dispatch(
      tankId: $tankId
      ruleSetId: $ruleSetId
      dispatch: $dispatch
      paysRemainingFee: $paysRemainingFee
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
