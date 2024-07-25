export default `mutation addToTracked($type: ModelType!, $chainIds:[BigInt!]!) {
    AddToTracked(type:$type, chainIds:$chainIds, hotSync:false)
}`;