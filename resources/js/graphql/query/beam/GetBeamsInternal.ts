export default `query GetBeams($codes: [String!], $names: [String!], $after: String = null, $first: Int = 15) {
    GetBeams(codes: $codes, names: $names, after: $after, first: $first) {
      edges {
        node {
          id
          code
          name
          description
          image
          start
          end
          collection {
            collectionId
          }
          isClaimable
          flags
          qr {
            url
            payload
          }
          claimConditions {
            type
            value
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }`;
