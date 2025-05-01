import { ApiService } from '.';
import mutations from './mutations';
import queries from './queries';

export class BeamApi {
    static async sendPlatfromRequest(data: Record<string, unknown>) {
        return ApiService.sendPlatformRequest(data, '/beam');
    }

    static async getBeam(getBeamData: Record<string, unknown>) {
        const data = {
            query: getBeamData.internal ? queries.GetBeamInternal : queries.GetBeam,
            variables: {
                code: getBeamData.code,
                account: getBeamData.account,
            },
        };

        return BeamApi.sendPlatfromRequest(data);
    }

    static async getBeams(getBeamsData: Record<string, unknown>) {
        const data = {
            query: getBeamsData.internal ? queries.GetBeamsInternal : queries.GetBeams,
            variables: {
                codes: getBeamsData.codes,
                names: getBeamsData.names,
                after: getBeamsData.after,
            },
        };

        return BeamApi.sendPlatfromRequest(data);
    }

    static async getClaims(getClaimsData: Record<string, unknown>) {
        const data = {
            query: queries.GetClaims,
            variables: {
                ids: getClaimsData.ids,
                codes: getClaimsData.codes,
                accounts: getClaimsData.accounts,
                states: getClaimsData.states,
                after: getClaimsData.after,
                first: 20,
            },
        };

        return BeamApi.sendPlatfromRequest(data);
    }

    static async getSingleUseCodes(getSingleUseCodesData: Record<string, unknown>) {
        const data = {
            query: getSingleUseCodesData.internal ? queries.GetSingleUseCodesInternal : queries.GetSingleUseCodes,
            variables: {
                code: getSingleUseCodesData.code,
                first: 20,
                after: getSingleUseCodesData.after,
                internal: getSingleUseCodesData.internal,
            },
        };

        return BeamApi.sendPlatfromRequest(data);
    }

    static async createBeam(createBeamData: Record<string, unknown>) {
        const data = {
            query: mutations.CreateBeam,
            variables: {
                name: createBeamData.name,
                description: createBeamData.description,
                image: createBeamData.image,
                start: createBeamData.start,
                end: createBeamData.end,
                flags: createBeamData.flags,
                claimLimit: createBeamData.claimLimit,
                collectionId: createBeamData.collectionId,
                tokens: createBeamData.tokens,
                signingAccount: createBeamData.signingAccount,
            },
        };

        return BeamApi.sendPlatfromRequest(data);
    }

    static async deleteBeam(deleteBeamData: Record<string, unknown>) {
        const data = {
            query: mutations.DeleteBeam,
            variables: {
                code: deleteBeamData.code,
                signingAccount: deleteBeamData.signingAccount,
            },
        };

        return BeamApi.sendPlatfromRequest(data);
    }

    static async expireSingleUseCodes(expireSingleUseCodesData: Record<string, unknown>) {
        const data = {
            query: mutations.ExpireSingleUseCodes,
            variables: {
                codes: expireSingleUseCodesData.codes,
                signingAccount: expireSingleUseCodesData.signingAccount,
            },
        };

        return BeamApi.sendPlatfromRequest(data);
    }

    static async updateBeam(updateBeamData: Record<string, unknown>) {
        const data = {
            query: mutations.UpdateBeam,
            variables: {
                code: updateBeamData.code,
                name: updateBeamData.name,
                description: updateBeamData.description,
                image: updateBeamData.image,
                start: updateBeamData.start,
                end: updateBeamData.end,
                flags: updateBeamData.flags,
                claimConditions: updateBeamData.claimConditions,
                signingAccount: updateBeamData.signingAccount,
            },
        };

        return BeamApi.sendPlatfromRequest(data);
    }
}
