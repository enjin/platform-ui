export default `query GetSingleUseCodes($code: String!, $after: String = null, $first: Int = 15, $internal: Boolean = false) {
    GetSingleUseCodes(
      code: $code
      after: $after
      first: $first
    ) {
      edges {
        node {
          id
          collection {
            collectionId
          }
          tokenId
          quantity
          claimedAt
          claimStatus
          type
          code
          qr {
            url
            payload
          }
          beam {
            name
            description
            start
            end
            isClaimable
            collection {
              collectionId
            }
            image
            flags
            claimConditions @include(if: $internal) {
              type
              value
            }
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
