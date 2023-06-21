export default `mutation RemoveAccount($tankId: String!, $userId: String!, $idempotencyKey: String) {
    RemoveAccount(tankId: $tankId, userId: $userId, idempotencyKey: $idempotencyKey) {
      id
    }
  }`;
