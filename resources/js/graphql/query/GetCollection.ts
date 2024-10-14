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
}`;
