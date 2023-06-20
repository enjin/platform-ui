export enum HttpMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

export enum NotificationType {
    Info,
    Error,
    Success,
}

export enum FreezeType {
    COLLECTION = 'COLLECTION',
    COLLECTION_ACCOUNT = 'COLLECTION_ACCOUNT',
    TOKEN = 'TOKEN',
    TOKEN_ACCOUNT = 'TOKEN_ACCOUNT',
}

export enum TransactionState {
    PENDING = 'PENDING',
    FINALIZED = 'FINALIZED',
    PROCESSING = 'PROCESSING',
    BROADCAST = 'BROADCAST',
    EXECUTED = 'EXECUTED',
    ABANDONED = 'ABANDONED',
}

export enum TokenCapType {
    SINGLE_MINT = 'SINGLE_MINT',
    SUPPLY = 'SUPPLY',
    INFINITE = 'INFINITE',
}

export enum TokenIdSelectType {
    Integer = 'integer',
    StringId = 'stringId',
    Hash = 'hash',
    Erc1155 = 'erc1155',
}

export enum TransferType {
    SimpleTransferToken = 'SimpleTransferToken',
    OperatorTransferToken = 'OperatorTransferToken',
}

export enum BatchType {
    BatchMint = 'BatchMint',
    BatchTransfer = 'BatchTransfer',
    BatchSetAttribute = 'BatchSetAttribute',
}

export enum CodeType {
    SingleUse = 'SingleUse',
    MultiUse = 'MultiUse',
}

export enum BeamFlag {
    PAUSED = 'PAUSED',
    SINGLE_USE = 'SINGLE_USE',
    PRUNABLE = 'PRUNABLE',
}

export enum BeamType {
    TRANSFER_TOKEN = 'TRANSFER_TOKEN',
    MINT_ON_DEMAND = 'MINT_ON_DEMAND',
}

export enum SignatureType {
    SR25519 = 'SR25519',
    ED25519 = 'ED25519',
}

export enum ClaimStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export enum TransactionResultType {
    TRANSACTION_SUCCESS = 'TRANSACTION_SUCCESS',
    TRANSACTION_FAILED = 'TRANSACTION_FAILED',
    EXTRINSIC_SUCCESS = 'EXTRINSIC_SUCCESS',
    EXTRINSIC_FAILED = 'EXTRINSIC_FAILED',
}

export enum TransactionMethods {
    ApproveCollection = 'ApproveCollection',
    ApproveToken = 'ApproveToken',
    BatchMint = 'BatchMint',
    BatchSetAttribute = 'BatchSetAttribute',
    BatchTransfer = 'BatchTransfer',
    Burn = 'Burn',
    CreateCollection = 'CreateCollection',
    CreateToken = 'CreateToken',
    DestroyCollection = 'DestroyCollection',
    Freeze = 'Freeze',
    MintToken = 'MintToken',
    MutateCollection = 'MutateCollection',
    MutateToken = 'Token',
    OperatorTransferToken = 'OperatorTransferToken',
    RemoveAllAttributes = 'RemoveAllAttributes',
    RemoveCollectionAttribute = 'RemoveCollectionAttribute',
    RemoveTokenAttribute = 'RemoveTokenAttribute',
    SetCollectionAttribute = 'SetCollectionAttribute',
    SetTokenAttribute = 'SetTokenAttribute',
    SimpleTransferToken = 'SimpleTransferToken',
    Thaw = 'Thaw',
    TransferAllBalance = 'TransferAllBalance',
    TransferBalance = 'TransferBalance',
    UnapproveCollection = 'UnapproveCollection',
    UnapproveToken = 'UnapproveToken',
}

export enum RuleType {
    WHITELISTED_CALLERS = 'WHITELISTED_CALLERS',
    WHITELISTED_COLLECTIONS = 'WHITELISTED_COLLECTIONS',
    MAX_FUEL_BURN_PER_TRANSACTION = 'MAX_FUEL_BURN_PER_TRANSACTION',
    USER_FUEL_BUDGET = 'USER_FUEL_BUDGET',
    TANK_FUEL_BUDGET = 'TANK_FUEL_BUDGET',
    REQUIRE_TOKEN = 'REQUIRE_TOKEN',
}
