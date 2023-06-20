import { ApiService } from '.';
import mutations from './mutations';
import queries from './queries';

export class AuthApi {
    static async login(email: string, password: string) {
        const data = {
            query: queries.Login,
            variables: {
                email,
                password,
            },
        };

        return ApiService.sendPlatfromRequest(data);
    }

    static async logout() {
        const data = {
            query: queries.Logout,
        };

        return ApiService.sendPlatfromRequest(data);
    }

    static async getUser() {
        const data = {
            query: queries.User,
        };

        return ApiService.sendPlatfromRequest(data);
    }

    static async register(email: string, password: string) {
        const data = {
            query: mutations.RegisterUser,
            variables: {
                email,
                password,
            },
        };

        return ApiService.sendPlatfromRequest(data);
    }

    static async requestPasswordReset(email: string) {
        const data = {
            query: mutations.RequestPasswordReset,
            variables: {
                email,
            },
        };

        return ApiService.sendPlatfromRequest(data);
    }

    static async resetPassword(email: string, password: string, passwordConfirmation: string, token: string) {
        const data = {
            query: mutations.ResetPassword,
            variables: {
                email,
                password,
                passwordConfirmation,
                token,
            },
        };

        return ApiService.sendPlatfromRequest(data);
    }

    static async createApiToken(name: string) {
        const data = {
            query: mutations.CreateApiToken,
            variables: {
                name,
            },
        };

        return ApiService.sendPlatfromRequest(data);
    }

    static async revokeApiTokens(names: [string]) {
        const data = {
            query: mutations.RevokeApiTokens,
            variables: {
                names,
            },
        };

        return ApiService.sendPlatfromRequest(data);
    }
}
