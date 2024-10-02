export default `query GetCollectionsIds($after: String, $first: Int) {
    GetCollections(after: $after, first: $first) {
        edges {
            node {
                collectionId
                owner {
                    account {
                        publicKey
                    }
                }
            }
            cursor
        }
        pageInfo {
            hasNextPage
            endCursor
        }
        totalCount
    }
}`;
