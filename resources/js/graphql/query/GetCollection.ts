export default `query GetCollection($collectionId: BigInt!) {
    GetCollection(collectionId: $collectionId) {
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
}`;
