import { BeamType, NotificationType, TokenCapType, TokenIdSelectType } from './types.enums';

export interface AppState {
    url?: URL;
    authorization_token: string;
    advanced: boolean;
    config: {
        url?: URL;
        authorization_token: string;
        route: string;
        network: string;
        packages: { name: string; version: string; link?: string }[];
        tenant: boolean;
        webSocket: string;
        channel: string;
    };
    navigations: any[];
    collections: string[];
    loggedIn: boolean;
    newCollection: boolean;
    user: any;
    provider: string;
    account: any;
    accounts: any;
}

export interface NotificationsState {
    notifications: NotificationInfo[];
}

export interface NotificationInfo {
    id: string;
    type: NotificationType;
    text: string;
    date: string;
}

export interface TokenIdType {
    tokenId: number | string;
    tokenType: TokenIdSelectType;
    index?: number;
}

export interface MintValuesInterface {
    mintType?: 'create' | 'mint';
    account?: string;
    createParams?: {
        tokenId: { [key: string]: { [key: string]: string | number } & (string | number) };
        initialSupply: number;
        unitPrice: number;
        cap: {
            type: TokenCapType;
            amount: number;
        };
        behavior: {
            isCurrency: boolean;
            hasRoyalty: {
                beneficiary: string;
                percentage: number;
            };
        };
        listingForbidden: boolean;
        attributes: { key: string; value: string }[];
    };
    mintParams?: {
        tokenId: { [key: string]: { [key: string]: string | number } & (string | number) };
        amount: number;
        unitPrice: number;
    };
}

export interface TransferValuesInterface {
    account?: string;
    simpleParams?: {
        tokenId: { [key: string]: { [key: string]: string | number } & (string | number) };
        amount: number;
        keepAlive: boolean;
    };
    operatorParams?: {
        tokenId: { [key: string]: { [key: string]: string | number } & (string | number) };
        source: string;
        amount: number;
        keepAlive: boolean;
    };
}

export interface ClaimTokenValuesInterface {
    type?: BeamType;
    tokenIds?: string[];
    tokenQuantityPerClaim?: number;
    claimQuantity?: number;
    attributes?: {
        key?: string;
        value?: string;
    }[];
}

export interface DispatchRulesValuesInterface {
    whitelistedCallers?: string[];
    requireToken?: {
        collectionId: string;
        tokenId: any;
    };
    whitelistedCollections?: string[];
    maxFuelBurnPerTransaction?: number;
    userFuelBudget?: {
        amount: number;
        resetPeriod: number;
    };
    tankFuelBudget?: {
        amount: number;
        resetPeriod: number;
    };
}
