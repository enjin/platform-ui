export default `mutation CreateListing($makeAssetId: MultiTokenIdInput!, $takeAssetId: MultiTokenIdInput!, $amount: BigInt!, $price: BigInt!, $salt: String, $listingData: ListingDataInput, $signingAccount: String, $idempotencyKey: String) {
    CreateListing(
      makeAssetId: $makeAssetId
      takeAssetId: $takeAssetId
      amount: $amount
      price: $price
      salt: $salt
      listingData: $listingData
      signingAccount: $signingAccount
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
