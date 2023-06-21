export default `mutation AddAccount($tankId: String!, $userId: String!, $idempotencyKey: String) {
    AddAccount(tankId: $tankId, userId: $userId, idempotencyKey: $idempotencyKey) {
      id
    }
  }`;
