export default `mutation FinalizeAuction($listingId: String!, $idempotencyKey: String) {
    FinalizeAuction(listingId: $listingId, idempotencyKey: $idempotencyKey) {
      id
    }
  }`;
