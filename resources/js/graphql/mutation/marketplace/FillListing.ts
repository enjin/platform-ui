export default `mutation FillListing($listingId: String!, $amount: BigInt!, $idempotencyKey: String) {
    FillListing(
      listingId: $listingId
      amount: $amount
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
