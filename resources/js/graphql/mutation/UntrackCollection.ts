export default `mutation removeFromTracked($type: ModelType! = COLLECTION, $chainIds: [BigInt!]!) {
    RemoveFromTracked(type: $type, chainIds: $chainIds)
}`;