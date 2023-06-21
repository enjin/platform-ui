export default `mutation DispatchAndTouch($tankId: String!, $ruleSetId: BigInt!, $dispatch: DispatchInputType!, $paysRemainingFee: Boolean = false, $idempotencyKey: String) {
    DispatchAndTouch(
      tankId: $tankId
      ruleSetId: $ruleSetId
      dispatch: $dispatch
      paysRemainingFee: $paysRemainingFee
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
