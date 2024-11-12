export default `query GetBeam($code: String!, $account: String) {
    GetBeam(code: $code, account: $account) {
      id
      code
      name
      description
      image
      start
      end
      collection {
        collectionId
      }
      isClaimable
      claimLimit
      claimsRemaining
      claimConditions {
        type
        value
      }
      flags
      qr {
        url
        payload
      }
    }
}`;
