export default `query Login($email: String!, $password: String!) {
    Login(email: $email, password: $password)
  }`;
