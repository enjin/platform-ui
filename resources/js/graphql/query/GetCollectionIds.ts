export default `query GetCollections($after: String, $first: Int) {
    GetCollections(after: $after, first: $first) {
        edges {
            node {
                collectionId
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
