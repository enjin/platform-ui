export default `query GetWallet($id: Int, $externalId: String, $verificationId: String, $account: String) {
    GetWallet(
      id: $id
      externalId: $externalId
      verificationId: $verificationId
      account: $account
    ) {
      id
      account {
        publicKey
      }
      externalId
      balances {
        free
        reserved
      }
      managed
      network
    }
}`;
