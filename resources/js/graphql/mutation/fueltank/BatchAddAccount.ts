export default `mutation BatchAddAccount($tankId: String!, $userIds: [String!]!, $idempotencyKey: String) {
    BatchAddAccount(
      tankId: $tankId
      userIds: $userIds
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
