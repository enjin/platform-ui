export default `query User {
    User {
      id
      email
      isVerified
      apiTokens {
        name
      }
      account
    }
  }`;
