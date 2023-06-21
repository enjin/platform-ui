export default `query GetTransaction($id: BigInt!) {
    GetTransaction(id: $id) {
        id
        method
        transactionHash
        result
        state
        transactionId
        events {
            edges {
            node {
                params {
                type
                value
                }
            }
            }
        }
    }
}`;
