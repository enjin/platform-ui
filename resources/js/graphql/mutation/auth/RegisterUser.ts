export default `mutation RegisterUser($email: String!, $password: String!) {
    RegisterUser(email: $email, password: $password) {
      id
      email
      isVerified
    }
  }`;
