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
      flags
      qr {
        url
        payload
      }
      claimConditions {
        type
        value
      }
    }
}`;
