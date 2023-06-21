export default `mutation ClaimBeam($code: String!, $account: String!, $signature: String, $cryptoSignatureType: CryptoSignatureType! = SR25519) {
    ClaimBeam(
      code: $code
      account: $account
      signature: $signature
      cryptoSignatureType: $cryptoSignatureType
    )
  }`;
