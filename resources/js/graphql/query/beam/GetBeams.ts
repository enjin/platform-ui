export default `query GetBeams($codes: [String!], $names: [String!], $after: String = null, $first: Int = 15, $internal: Boolean = false) {
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
          claimConditions @include(if: $internal) {
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
