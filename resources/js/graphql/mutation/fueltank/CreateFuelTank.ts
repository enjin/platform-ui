export default `mutation CreateFuelTank($name: String!, $reservesExistentialDeposit: Boolean, $reservesAccountCreationDeposit: Boolean, $providesDeposit: Boolean!, $accountRules: AccountRuleInputType, $dispatchRules: [DispatchRuleInputType!], $idempotencyKey: String) {
    CreateFuelTank(
      name: $name
      reservesExistentialDeposit: $reservesExistentialDeposit
      reservesAccountCreationDeposit: $reservesAccountCreationDeposit
      providesDeposit: $providesDeposit
      accountRules: $accountRules
      dispatchRules: $dispatchRules
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
