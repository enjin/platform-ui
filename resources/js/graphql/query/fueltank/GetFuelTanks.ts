export default `query GetFuelTanks($names: [String!], $tankIds: [String!], $after: String = null, $first: Int = 15) {
    GetFuelTanks(names: $names, tankIds: $tankIds, after: $after, first: $first) {
      edges {
        node {
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
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
}`;
