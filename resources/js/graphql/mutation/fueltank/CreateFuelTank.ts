export default `mutation CreateFuelTank($name: String!, $reservesAccountCreationDeposit: Boolean, $coveragePolicy: CoveragePolicy = FEES, $accountRules: AccountRuleInputType, $dispatchRules: [DispatchRuleInputType!], $requireAccount: Boolean = false, $signingAccount: String, $idempotencyKey: String) {
    CreateFuelTank(
      name: $name
      reservesAccountCreationDeposit: $reservesAccountCreationDeposit
      coveragePolicy: $coveragePolicy
      accountRules: $accountRules
      dispatchRules: $dispatchRules
      requireAccount: $requireAccount
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
