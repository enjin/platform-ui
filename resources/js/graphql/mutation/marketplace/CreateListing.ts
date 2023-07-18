export default `mutation CreateListing($account: String!, $makeAssetId: MultiTokenIdInput!, $takeAssetId: MultiTokenIdInput!, $amount: BigInt!, $price: BigInt!, $salt: String, $auctionData: AuctionDataInputType, $idempotencyKey: String) {
    CreateListing(
      account: $account
      makeAssetId: $makeAssetId
      takeAssetId: $takeAssetId
      amount: $amount
      price: $price
      salt: $salt
      auctionData: $auctionData
      idempotencyKey: $idempotencyKey
    ) {
      id
    }
  }`;
