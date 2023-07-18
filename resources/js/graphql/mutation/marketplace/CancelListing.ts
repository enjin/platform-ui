export default `mutation CancelListing($listingId: String!, $idempotencyKey: String) {
    CancelListing(listingId: $listingId, idempotencyKey: $idempotencyKey) {
      id
    }
  }`;
