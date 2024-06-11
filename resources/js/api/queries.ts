import GetTransaction from '~/graphql/query/GetTransaction';
import GetCollections from '~/graphql/query/GetCollections';
import GetCollectionIds from '~/graphql/query/GetCollectionIds';
import GetCollection from '~/graphql/query/GetCollection';
import GetTokens from '~/graphql/query/GetTokens';
import GetTransactions from '~/graphql/query/GetTransactions';
import GetWallet from '~/graphql/query/GetWallet';
import GetWallets from '~/graphql/query/GetWallets';

import GetBeam from '~/graphql/query/beam/GetBeam';
import GetBeamInternal from '~/graphql/query/beam/GetBeamInternal';
import GetBeams from '~/graphql/query/beam/GetBeams';
import GetBeamsInternal from '~/graphql/query/beam/GetBeamsInternal';
import GetClaims from '~/graphql/query/beam/GetClaims';
import GetSingleUseCodes from '~/graphql/query/beam/GetSingleUseCodes';
import GetSingleUseCodesInternal from '~/graphql/query/beam/GetSingleUseCodesInternal';

import Login from '~/graphql/query/auth/Login';
import LoginRecaptcha from '~/graphql/query/auth/LoginRecaptcha';
import Logout from '~/graphql/query/auth/Logout';
import User from '~/graphql/query/auth/User';

import GetFuelTanks from '~/graphql/query/fueltank/GetFuelTanks';
import GetFuelTank from '~/graphql/query/fueltank/GetFuelTank';
import GetAccounts from '~/graphql/query/fueltank/GetAccounts';

import GetListings from '~/graphql/query/marketplace/GetListings';
import GetBids from '~/graphql/query/marketplace/GetBids';
import GetSales from '~/graphql/query/marketplace/GetSales';
import GetBlocks from '~/graphql/query/marketplace/GetBlocks';

export default {
    GetTransaction,
    GetCollections,
    GetCollectionIds,
    GetCollection,
    GetTokens,
    GetTransactions,
    GetWallet,
    GetWallets,

    GetBeam,
    GetBeamInternal,
    GetBeams,
    GetBeamsInternal,
    GetClaims,
    GetSingleUseCodes,
    GetSingleUseCodesInternal,

    Login,
    LoginRecaptcha,
    Logout,
    User,

    GetFuelTanks,
    GetFuelTank,
    GetAccounts,

    GetListings,
    GetBids,
    GetSales,
    GetBlocks,
};
