import { TokenIdSelectType } from '~/types/types.enums';
import { TokenIdType } from '~/types/types.interface';
import snackbar from '~/util/snackbar';

export const formatData = (entries: any, type = 'object') => {
    const data: { [key: string]: any } = type === 'object' ? {} : [];

    // eslint-disable-next-line
    for (let [key, value] of Object.entries(entries)) {
        if (value === null || value === undefined) {
            continue;
        }
        if (Array.isArray(value) && value.length === 0) {
            continue;
        }
        if (typeof value === 'string' && value.length === 0) {
            continue;
        }
        if (typeof value === 'object') {
            value = formatData(value, Array.isArray(value) ? 'array' : 'object');
            if (Object.keys(value as any).length === 0) {
                continue;
            }
        }

        data[key] = value;
    }

    return data;
};

export const formatTokens = (tokensData: any) => {
    if (!tokensData) return null;

    return tokensData
        .map((tokenData: TokenIdType) => {
            return formatToken(tokenData);
        })
        .filter((tokenData: TokenIdType) => tokenData !== null);
};

export const formatToken = (tokenData: TokenIdType) => {
    if (!tokenData || tokenData.tokenId === '') return null;

    if (tokenData.tokenType === TokenIdSelectType.Erc1155) {
        return {
            [tokenData.tokenType]: {
                tokenId: tokenData.tokenId,
                index: tokenData.index,
            },
        };
    }

    return {
        [tokenData.tokenType ?? TokenIdSelectType.Integer]: tokenData.tokenId,
    };
};

export const parseFormatedTokenId = (tokenData: {
    [key: string]: { [key: string]: string | number } & (string | number);
}): TokenIdType | null => {
    if (!tokenData) return null;

    if (tokenData?.erc1155) {
        return {
            tokenId: tokenData.erc1155.tokenId as string,
            tokenType: TokenIdSelectType.Erc1155,
            index: tokenData.erc1155.index as number | undefined,
        };
    }

    const key = Object.keys(tokenData)[0];

    return {
        tokenId: tokenData[key],
        tokenType: key as TokenIdSelectType,
    };
};

export const formatPriceToENJ = (price: any) => {
    if (!price) return null;

    return price * 1000000000000000000;
};

export const formatPriceFromENJ = (price: any) => {
    if (!price) return null;

    return price / 1000000000000000000;
};

export const snackbarErrors = (errors: any) => {
    if (!errors.length) return false;

    errors.map((error: any) => {
        snackbar.error({ title: error.field ?? null, text: error.message });
    });

    return true;
};

export const formatVariables = (variables: any) => {
    return variables.map((item: any) => {
        return { [item.key]: item.value };
    });
};

export const formatWhitelistedCallers = (whitelistedCallers: any) => {
    if (!whitelistedCallers?.length) return null;

    return whitelistedCallers.map((item: any) => {
        return { caller: item };
    });
};

export const formatWhitelistedCollections = (whitelistedCollections: any) => {
    if (!whitelistedCollections?.length) return null;

    return whitelistedCollections.map((item: any) => {
        return { collection: item };
    });
};

export const currencySymbolByNetwork = (network: string) => {
    if (network === 'canary') {
        return 'cENJ';
    }

    return 'ENJ';
};
