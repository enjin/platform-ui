export default `mutation removeFromTracked($type: ModelType!, $chainIds: [BigInt!]!) {
    RemoveFromTracked(type:$type, chainIds:$chainIds)
}`;