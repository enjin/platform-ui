export default `mutation CreateApiToken($name: String!) {
    CreateApiToken(name: $name) {
      name
      plainTextToken
    }
  }`;
