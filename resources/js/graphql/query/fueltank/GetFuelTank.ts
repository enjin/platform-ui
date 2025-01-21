export default `query GetFuelTank($name: String, $tankId: String) {
    GetFuelTank(name: $name, tankId: $tankId) {
      tankId {
        publicKey
      }
      name
      reservesAccountCreationDeposit
      coveragePolicy
      isFrozen
      accountCount
      owner {
        account {
          publicKey
        }
      }
      accountRules {
        rule
        value
      }
      dispatchRules {
        rule
        ruleSetId
        value
        isFrozen
      }
      reservesExistentialDeposit
      reservesAccountCreationDeposit
      providesDeposit
    }
}`;
