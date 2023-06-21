export default `mutation MutateFuelTank($tankId: String!, $mutation: FuelTankMutationInputType!, $idempotencyKey: String) {
    MutateFuelTank(
      tankId: $tankId
      mutation: $mutation
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
