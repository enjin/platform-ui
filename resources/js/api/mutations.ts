import CreateCollection from '~/graphql/mutation/collection/CreateCollection';
import ApproveCollection from '~/graphql/mutation/collection/ApproveCollection';
import UnapproveCollection from '~/graphql/mutation/collection/UnapproveCollection';
import MutateCollection from '~/graphql/mutation/collection/MutateCollection';
import DestroyCollection from '~/graphql/mutation/collection/DestroyCollection';
import RemoveCollectionAttribute from '~/graphql/mutation/collection/RemoveCollectionAttribute';
import SetCollectionAttribute from '~/graphql/mutation/collection/SetCollectionAttribute';
import TrackCollection from '~/graphql/mutation/TrackCollection';
import UntrackCollection from '~/graphql/mutation/UntrackCollection';

import CreateToken from '~/graphql/mutation/token/CreateToken';
import MintToken from '~/graphql/mutation/token/MintToken';
import ApproveToken from '~/graphql/mutation/token/ApproveToken';
import UnapproveToken from '~/graphql/mutation/token/UnapproveToken';
import BurnToken from '~/graphql/mutation/token/BurnToken';
import MutateToken from '~/graphql/mutation/token/MutateToken';
import OperatorTransferToken from '~/graphql/mutation/token/OperatorTransferToken';
import SimpleTransferToken from '~/graphql/mutation/token/SimpleTransferToken';
import RemoveTokenAttribute from '~/graphql/mutation/token/RemoveTokenAttribute';
import SetTokenAttribute from '~/graphql/mutation/token/SetTokenAttribute';
import InfuseToken from '~/graphql/mutation/token/InfuseToken';

import RemoveAllAttributes from '~/graphql/mutation/RemoveAllAttributes';
import Freeze from '~/graphql/mutation/Freeze';
import Thaw from '~/graphql/mutation/Thaw';
import UpdateTransaction from '~/graphql/mutation/UpdateTransaction';
import TransferBalance from '~/graphql/mutation/TransferBalance';

import BatchMint from '~/graphql/mutation/batch/BatchMint';
import BatchTransfer from '~/graphql/mutation/batch/BatchTransfer';
import BatchSetAttribute from '~/graphql/mutation/batch/BatchSetAttribute';

import UpdateBeam from '~/graphql/mutation/beam/UpdateBeam';
import DeleteBeam from '~/graphql/mutation/beam/DeleteBeam';
import CreateBeam from '~/graphql/mutation/beam/CreateBeam';
import ExpireSingleUseCodes from '~/graphql/mutation/beam/ExpireSingleUseCodes';

import RetryTransactions from '~/graphql/mutation/RetryTransactions';

import RegisterUser from '~/graphql/mutation/auth/RegisterUser';
import RegisterUserRecaptcha from '~/graphql/mutation/auth/RegisterUserRecaptcha';
import ResetPassword from '~/graphql/mutation/auth/ResetPassword';
import RequestPasswordReset from '~/graphql/mutation/auth/RequestPasswordReset';
import RequestPasswordResetRecaptcha from '~/graphql/mutation/auth/RequestPasswordResetRecaptcha';
import CreateApiToken from '~/graphql/mutation/auth/CreateApiToken';
import RevokeApiTokens from '~/graphql/mutation/auth/RevokeApiTokens';
import ResendVerifyEmail from '~/graphql/query/auth/ResendVerifyEmail';
import ChangePassword from '~/graphql/mutation/auth/ChangePassword';
import DeleteAccount from '~/graphql/mutation/auth/DeleteAccount';
import UpdateUser from '~/graphql/mutation/auth/UpdateUser';

import AddAccount from '~/graphql/mutation/fueltank/AddAccount';
import RemoveAccount from '~/graphql/mutation/fueltank/RemoveAccount';
import CreateFuelTank from '~/graphql/mutation/fueltank/CreateFuelTank';
import BatchAddAccount from '~/graphql/mutation/fueltank/BatchAddAccount';
import BatchRemoveAccount from '~/graphql/mutation/fueltank/BatchRemoveAccount';
import DestroyFuelTank from '~/graphql/mutation/fueltank/DestroyFuelTank';
import MutateFuelTank from '~/graphql/mutation/fueltank/MutateFuelTank';
import Dispatch from '~/graphql/mutation/fueltank/Dispatch';
import DispatchAndTouch from '~/graphql/mutation/fueltank/DispatchAndTouch';
import InsertRuleSet from '~/graphql/mutation/fueltank/InsertRuleSet';
import RemoveAccountRuleData from '~/graphql/mutation/fueltank/RemoveAccountRuleData';
import RemoveRuleSet from '~/graphql/mutation/fueltank/RemoveRuleSet';
import ScheduleMutateFreezeState from '~/graphql/mutation/fueltank/ScheduleMutateFreezeState';
import SetConsumption from '~/graphql/mutation/fueltank/SetConsumption';

import CreateListing from '~/graphql/mutation/marketplace/CreateListing';
import CancelListing from '~/graphql/mutation/marketplace/CancelListing';
import FillListing from '~/graphql/mutation/marketplace/FillListing';
import PlaceBid from '~/graphql/mutation/marketplace/PlaceBid';
import FinalizeAuction from '~/graphql/mutation/marketplace/FinalizeAuction';

export default {
    CreateCollection,
    ApproveCollection,
    UnapproveCollection,
    MutateCollection,
    DestroyCollection,
    RemoveCollectionAttribute,
    SetCollectionAttribute,
    TrackCollection,
    UntrackCollection,

    CreateToken,
    MintToken,
    ApproveToken,
    UnapproveToken,
    BurnToken,
    MutateToken,
    SimpleTransferToken,
    OperatorTransferToken,
    RemoveTokenAttribute,
    SetTokenAttribute,
    InfuseToken,

    RemoveAllAttributes,
    Freeze,
    Thaw,
    UpdateTransaction,
    TransferBalance,

    BatchMint,
    BatchTransfer,
    BatchSetAttribute,

    UpdateBeam,
    DeleteBeam,
    CreateBeam,
    ExpireSingleUseCodes,

    RetryTransactions,

    RegisterUser,
    RegisterUserRecaptcha,
    ResetPassword,
    RequestPasswordReset,
    RequestPasswordResetRecaptcha,
    CreateApiToken,
    RevokeApiTokens,
    ResendVerifyEmail,
    ChangePassword,
    DeleteAccount,
    UpdateUser,

    AddAccount,
    RemoveAccount,
    CreateFuelTank,
    BatchAddAccount,
    BatchRemoveAccount,
    DestroyFuelTank,
    MutateFuelTank,
    Dispatch,
    DispatchAndTouch,
    InsertRuleSet,
    RemoveAccountRuleData,
    RemoveRuleSet,
    ScheduleMutateFreezeState,
    SetConsumption,

    CreateListing,
    CancelListing,
    FillListing,
    PlaceBid,
    FinalizeAuction,
};
