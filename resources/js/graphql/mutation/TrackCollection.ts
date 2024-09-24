export default `mutation addToTracked($type: ModelType! = COLLECTION, $chainIds:[BigInt!]!, $hotSync: Boolean = false) {
    AddToTracked(type: $type, chainIds: $chainIds, hotSync: $hotSync)
}`;
