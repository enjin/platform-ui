export default `mutation ChangePassword(
    $password: String!
    $passwordConfirmation: String!
    $oldPassword: String!
  ) {
    ChangePassword(
      password: $password
      passwordConfirmation: $passwordConfirmation
      oldPassword: $oldPassword
    )
  }
`;
