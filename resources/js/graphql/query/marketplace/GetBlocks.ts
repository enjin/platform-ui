export default `query GetBlocks($first: Int) {
    GetBlocks(first: $first) {
        edges {
            node {
                number
            }
        }
    }
}`;
