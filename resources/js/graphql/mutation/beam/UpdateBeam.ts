export default `mutation UpdateBeam($code: String!, $name: String, $description: String, $image: String, $start: DateTime, $end: DateTime, $flags: [BeamFlagInputType!], $claimConditions:  [ClaimConditionInputType]) {
    UpdateBeam(
      code: $code
      name: $name
      description: $description
      image: $image
      start: $start
      end: $end
      flags: $flags
      claimConditions: $claimConditions
    )
  }`;
