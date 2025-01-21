import { ApiService } from '.';
import mutations from './mutations';
import queries from './queries';

export class FuelTankApi {
    static async sendPlatfromRequest(data: Record<string, unknown>) {
        return ApiService.sendPlatformRequest(data, '/fuel-tanks');
    }

    static async getFuelTank(name: string, tankId: string) {
        const data = {
            query: queries.GetFuelTank,
            variables: {
                name,
                tankId,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async getFuelTanks(getFuelTanksData: Record<string, unknown>) {
        const data = {
            query: queries.GetFuelTanks,
            variables: {
                names: getFuelTanksData.names,
                tankIds: getFuelTanksData.tankIds,
                after: getFuelTanksData.after,
                first: 20,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async getAccounts(tankId: string, after: string | null = null) {
        const data = {
            query: queries.GetAccounts,
            variables: {
                tankId,
                after,
                first: 20,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async addAccount(addAccountData: Record<string, unknown>) {
        const data = {
            query: mutations.AddAccount,
            variables: {
                tankId: addAccountData.tankId,
                userId: addAccountData.userId,
                idempotencyKey: addAccountData.idempotencyKey,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async removeAccount(removeAccountData: Record<string, unknown>) {
        const data = {
            query: mutations.RemoveAccount,
            variables: {
                tankId: removeAccountData.tankId,
                userId: removeAccountData.userId,
                idempotencyKey: removeAccountData.idempotencyKey,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async batchAddAccount(batchAddAccountData: Record<string, unknown>) {
        const data = {
            query: mutations.BatchAddAccount,
            variables: {
                tankId: batchAddAccountData.tankId,
                userIds: batchAddAccountData.userIds,
                idempotencyKey: batchAddAccountData.idempotencyKey,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async batchRemoveAccount(batchRemoveAccountData: Record<string, unknown>) {
        const data = {
            query: mutations.BatchRemoveAccount,
            variables: {
                tankId: batchRemoveAccountData.tankId,
                userIds: batchRemoveAccountData.userIds,
                idempotencyKey: batchRemoveAccountData.idempotencyKey,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async createFuelTank(createFuelTankData: Record<string, unknown>) {
        const data = {
            query: mutations.CreateFuelTank,
            variables: {
                name: createFuelTankData.name,
                reservesAccountCreationDeposit: createFuelTankData.reservesAccountCreationDeposit,
                coveragePolicy: createFuelTankData.coveragePolicy,
                accountRules: createFuelTankData.accountRules,
                requireAccount: createFuelTankData.requireAccount,
                signingAccount: createFuelTankData.signingAccount,
                dispatchRules: createFuelTankData.dispatchRules,
                idempotencyKey: createFuelTankData.idempotencyKey,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async destroyFuelTank(destroyFuelTankData: Record<string, unknown>) {
        const data = {
            query: mutations.DestroyFuelTank,
            variables: {
                tankId: destroyFuelTankData.tankId,
                idempotencyKey: destroyFuelTankData.idempotencyKey,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async mutateFuelTank(mutateFuelTankData: Record<string, unknown>) {
        const data = {
            query: mutations.MutateFuelTank,
            variables: {
                tankId: mutateFuelTankData.tankId,
                mutation: mutateFuelTankData.mutation,
                idempotencyKey: mutateFuelTankData.idempotencyKey,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async dispatch(dispatchData: Record<string, unknown>, touch: boolean = false) {
        const data = {
            query: touch ? mutations.DispatchAndTouch : mutations.Dispatch,
            variables: {
                tankId: dispatchData.tankId,
                ruleSetId: dispatchData.ruleSetId,
                dispatch: dispatchData.dispatch,
                paysRemainingFee: dispatchData.paysRemainingFee,
                idempotencyKey: dispatchData.idempotencyKey,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async insertRuleSet(insertRuleSetData: Record<string, unknown>) {
        const data = {
            query: mutations.InsertRuleSet,
            variables: {
                tankId: insertRuleSetData.tankId,
                ruleSetId: insertRuleSetData.ruleSetId,
                dispatchRules: insertRuleSetData.dispatchRules,
                idempotencyKey: insertRuleSetData.idempotencyKey,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async removeRuleSet(removeRuleSetData: Record<string, unknown>) {
        const data = {
            query: mutations.RemoveRuleSet,
            variables: {
                tankId: removeRuleSetData.tankId,
                ruleSetId: removeRuleSetData.ruleSetId,
                idempotencyKey: removeRuleSetData.idempotencyKey,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async setConsumption(setConsumptionData: Record<string, unknown>) {
        const data = {
            query: mutations.SetConsumption,
            variables: {
                tankId: setConsumptionData.tankId,
                ruleSetId: setConsumptionData.ruleSetId,
                userId: setConsumptionData.userId,
                totalConsumed: setConsumptionData.totalConsumed,
                lastResetBlock: setConsumptionData.lastResetBlock,
                idempotencyKey: setConsumptionData.idempotencyKey,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async scheduleMutateFreezeState(scheduleMutateFreezeStateData: Record<string, unknown>) {
        const data = {
            query: mutations.ScheduleMutateFreezeState,
            variables: {
                tankId: scheduleMutateFreezeStateData.tankId,
                isFrozen: scheduleMutateFreezeStateData.isFrozen,
                ruleSetId: scheduleMutateFreezeStateData.ruleSetId,
                idempotencyKey: scheduleMutateFreezeStateData.idempotencyKey,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }

    static async removeAccountRuleData(removeAccountRuleData: Record<string, unknown>) {
        const data = {
            query: mutations.RemoveAccountRuleData,
            variables: {
                tankId: removeAccountRuleData.tankId,
                userId: removeAccountRuleData.userId,
                ruleSetId: removeAccountRuleData.ruleSetId,
                rule: removeAccountRuleData.rule,
                idempotencyKey: removeAccountRuleData.idempotencyKey,
            },
        };

        return FuelTankApi.sendPlatfromRequest(data);
    }
}
