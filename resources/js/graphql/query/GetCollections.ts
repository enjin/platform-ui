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
                maxTokenCount
                maxTokenSupply
                forceCollapsingSupply
                totalInfusion
                totalDeposit
                creationDeposit {
                    depositor {
                        account {
                            publicKey
                        }
                    }
                    amount
                }
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
