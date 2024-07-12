export default `mutation UpdateUser($email: String, $password: String, $walletAccounts: [String!]) {
    UpdateUser(email: $email, password: $password, walletAccounts: $walletAccounts)
  }`;
