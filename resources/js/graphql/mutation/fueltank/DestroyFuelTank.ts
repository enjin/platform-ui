export default `mutation DestroyFuelTank($tankId: String!, $idempotencyKey: String) {
    DestroyFuelTank(tankId: $tankId, idempotencyKey: $idempotencyKey) {
      id
    }
  }`;
