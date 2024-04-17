export default `query Login($email: String!, $password: String!, $recaptcha: String) {
    Login(email: $email, password: $password, recaptchaResponse: $recaptcha)
  }`;
