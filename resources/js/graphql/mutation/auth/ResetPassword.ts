export default `mutation ResetPassword($email: String!, $password: String!, $passwordConfirmation: String!, $token: String!) {
    ResetPassword(
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
      passwordResetToken: $token
    )
  }`;
