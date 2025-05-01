export default `mutation CancelListing($listingId: String!, $signingAccount: String, $idempotencyKey: String) {
    CancelListing(listingId: $listingId, signingAccount: $signingAccount, idempotencyKey: $idempotencyKey) {
      id
    }
  }`;
