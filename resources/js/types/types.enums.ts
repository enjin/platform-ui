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
    COLLAPSING_SUPPLY = 'COLLAPSING_SUPPLY',
}

export enum FreezeStateType {
    PERMANENT = 'PERMANENT',
    TEMPORARY = 'TEMPORARY',
    NEVER = 'NEVER',
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

export enum DispatchRules {
    WhitelistedCallers = 'WhitelistedCallers',
    WhitelistedCollections = 'WhitelistedCollections',
    MaxFuelBurnPerTransaction = 'MaxFuelBurnPerTransaction',
    UserFuelBudget = 'UserFuelBudget',
    TankFuelBudget = 'TankFuelBudget',
    RequireToken = 'RequireToken',
    PermittedExtrinsic = 'PermittedExtrinsic',
    RequireSignature = 'RequireSignature',
}

export enum TransactionMethods {
    AcceptCollectionTransfer = 'AcceptCollectionTransfer',
    AddAccount = 'AddAccount',
    ApproveCollection = 'ApproveCollection',
    ApproveToken = 'ApproveToken',
    BatchAddAccount = 'BatchAddAccount',
    BatchMint = 'BatchMint',
    BatchRemoveAccount = 'BatchRemoveAccount',
    BatchSetAttribute = 'BatchSetAttribute',
    BatchTransfer = 'BatchTransfer',
    BatchTransferBalance = 'BatchTransferBalance',
    Burn = 'Burn',
    CancelListing = 'CancelListing',
    CreateCollection = 'CreateCollection',
    CreateFuelTank = 'CreateFuelTank',
    CreateListing = 'CreateListing',
    CreateToken = 'CreateToken',
    DestroyCollection = 'DestroyCollection',
    DestroyFuelTank = 'DestroyFuelTank',
    Dispatch = 'Dispatch',
    DispatchAndTouch = 'DispatchAndTouch',
    FillListing = 'FillListing',
    FinalizeAuction = 'FinalizeAuction',
    Freeze = 'Freeze',
    Infuse = 'Infuse',
    InsertRuleSet = 'InsertRuleSet',
    LimitedTeleportAssets = 'LimitedTeleportAssets',
    MintToken = 'MintToken',
    MutateCollection = 'MutateCollection',
    MutateFuelTank = 'MutateFuelTank',
    MutateToken = 'MutateToken',
    OperatorTransferToken = 'OperatorTransferToken',
    PlaceBid = 'PlaceBid',
    RemoveAccount = 'RemoveAccount',
    RemoveAccountRuleData = 'RemoveAccountRuleData',
    RemoveAllAttributes = 'RemoveAllAttributes',
    RemoveCollectionAttribute = 'RemoveCollectionAttribute',
    RemoveRuleSet = 'RemoveRuleSet',
    RemoveTokenAttribute = 'RemoveTokenAttribute',
    ScheduleMutateFreezeState = 'ScheduleMutateFreezeState',
    SetCollectionAttribute = 'SetCollectionAttribute',
    SetConsumption = 'SetConsumption',
    SetTokenAttribute = 'SetTokenAttribute',
    SimpleTransferToken = 'SimpleTransferToken',
    Thaw = 'Thaw',
    TransferAllBalance = 'TransferAllBalance',
    TransferAllowDeath = 'TransferAllowDeath',
    TransferBalance = 'TransferBalance',
    TransferKeepAlive = 'TransferKeepAlive',
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

export enum ResetPasswordResponse {
    PASSWORD_RESET = 'PASSWORD_RESET',
    INVALID_TOKEN = 'INVALID_TOKEN',
    INVALID_USER = 'INVALID_USER',
}
