export default `query GetCollections($after: String, $first: Int) {
    GetCollections(after: $after, first: $first) {
        edges {
            node {
                collectionId
                owner {
                    account {
                        publicKey
                    }
                }
                frozen
                royalty {
                    beneficiary {
                        account {
                            publicKey
                        }
                    }
                    percentage
                }
                attributes {
                    key
                    value
                }
                network
                tokens {
                    totalCount
                }
            }
            cursor
        }
        pageInfo {
            hasNextPage
            endCursor
        }
    }
}`;
