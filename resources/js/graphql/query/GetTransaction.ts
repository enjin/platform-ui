export default `query GetTransaction($id: BigInt!) {
    GetTransaction(id: $id) {
        id
        wallet {
          account {
            publicKey
          }
        }
        transactionHash
        method
        result
        state
        fee
        deposit
        transactionId
        encodedData
        signedAtBlock
        events {
          edges {
            node {
              moduleId
              eventId
              params {
                type
                value
              }
            }
          }
        }
    }
}`;
