export default `mutation RevokeApiTokens($names: [String!]!) {
    RevokeApiTokens(names: $names)
  }`;
