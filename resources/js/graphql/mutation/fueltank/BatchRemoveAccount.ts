export default `mutation BatchRemoveAccount($tankId: String!, $userIds: [String!]!, $idempotencyKey: String) {
    BatchRemoveAccount(
      tankId: $tankId
      userIds: $userIds
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
