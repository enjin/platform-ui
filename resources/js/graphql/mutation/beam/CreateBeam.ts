export default `mutation CreateBeam($name: String!, $description: String!, $image: String!, $start: DateTime!, $end: DateTime!, $claimLimit: Int, $flags: [BeamFlagInputType!], $collectionId: BigInt!, $tokens: [ClaimToken!]!) {
    CreateBeam(
      name: $name
      description: $description
      image: $image
      start: $start
      end: $end
      flags: $flags
      claimLimit: $claimLimit
      collectionId: $collectionId
      tokens: $tokens
    )
  }`;
