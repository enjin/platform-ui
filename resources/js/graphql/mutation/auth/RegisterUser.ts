export default `mutation RegisterUser($email: String!, $password: String!, $recaptcha: String!) {
    RegisterUser(email: $email, password: $password, recaptchaResponse: $recaptcha) {
      id
      email
      isVerified
    }
  }`;
