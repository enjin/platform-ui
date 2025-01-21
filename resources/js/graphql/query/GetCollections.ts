export default `query GetCollections($collectionIds: [BigInt], $after: String, $first: Int) {
    GetCollections(collectionIds: $collectionIds, after: $after, first: $first) {
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
