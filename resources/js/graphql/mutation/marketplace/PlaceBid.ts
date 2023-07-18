export default `mutation PlaceBid($listingId: String!, $price: BigInt!, $idempotencyKey: String) {
    PlaceBid(listingId: $listingId, price: $price, idempotencyKey: $idempotencyKey) {
      id
    }
  }`;
