export default `mutation addToTracked($type: ModelType! = COLLECTION, $chainIds:[BigInt!]!) {
    AddToTracked(type: $type, chainIds: $chainIds, hotSync: false)
}`;