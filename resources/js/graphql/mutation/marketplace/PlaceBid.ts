export default `mutation PlaceBid($listingId: String!, $price: BigInt!, $signingAccount: String, $idempotencyKey: String) {
    PlaceBid(listingId: $listingId, price: $price, $signingAccount: $signingAccount, idempotencyKey: $idempotencyKey) {
      id
    }
  }`;
