export default `mutation RequestPasswordReset($email: String!, $recaptcha: String!) {
    RequestPasswordReset(email: $email, recaptchaResponse: $recaptcha)
  }`;
