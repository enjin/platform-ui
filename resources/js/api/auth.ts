import { ApiService } from '.';
import mutations from './mutations';
import queries from './queries';

export class AuthApi {
    static async sendPlatfromRequest(data: Record<string, unknown>) {
        return ApiService.sendPlatformRequest(data, '/multi-tenant');
    }

    static async login(email: string, password: string) {
        const data = {
            query: queries.Login,
            variables: {
                email,
                password,
            },
        };

        return AuthApi.sendPlatfromRequest(data);
    }

    static async logout() {
        const data = {
            query: queries.Logout,
        };

        return AuthApi.sendPlatfromRequest(data);
    }

    static async getUser() {
        const data = {
            query: queries.User,
        };

        return AuthApi.sendPlatfromRequest(data);
    }

    static async register(email: string, password: string) {
        const data = {
            query: mutations.RegisterUser,
            variables: {
                email,
                password,
            },
        };

        return AuthApi.sendPlatfromRequest(data);
    }

    static async requestPasswordReset(email: string) {
        const data = {
            query: mutations.RequestPasswordReset,
            variables: {
                email,
            },
        };

        return AuthApi.sendPlatfromRequest(data);
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

        return AuthApi.sendPlatfromRequest(data);
    }

    static async createApiToken(name: string) {
        const data = {
            query: mutations.CreateApiToken,
            variables: {
                name,
            },
        };

        return AuthApi.sendPlatfromRequest(data);
    }

    static async revokeApiTokens(names: [string]) {
        const data = {
            query: mutations.RevokeApiTokens,
            variables: {
                names,
            },
        };

        return AuthApi.sendPlatfromRequest(data);
    }

    static async updateUser({ email, account }: { email?: string; account?: string }) {
        const data = {
            query: mutations.UpdateUser,
            variables: {
                email,
                account,
            },
        };

        return AuthApi.sendPlatfromRequest(data);
    }
}
