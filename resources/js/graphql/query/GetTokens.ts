export default `query GetTokens($collectionId: BigInt, $tokenIds: [EncodableTokenIdInput], $after: String = null, $first: Int = 15) {
    GetTokens(
        collectionId: $collectionId
        tokenIds: $tokenIds
        after: $after
        first: $first
    ) {
        edges {
            node {
                tokenId
                isFrozen
                supply
                capSupply
                attributeCount
                attributes {
                    key
                    value
                }
                metadata
                isCurrency
                nonFungible
                royalty {
                    beneficiary {
                        account {
                            publicKey
                        }
                    }
                    percentage
                }
                accounts {
                    edges {
                        node {
                            wallet {
                                account {
                                    publicKey
                                }
                            }
                        }
                    }
                    totalCount
                }
                collection {
                    collectionId
                    network
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
