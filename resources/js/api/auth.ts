import { ApiService } from '.';
import mutations from './mutations';
import queries from './queries';

export class AuthApi {
    static async sendPlatfromRequest(data: Record<string, unknown>) {
        return ApiService.sendPlatformRequest(data, '/multi-tenant');
    }

    static async login(email: string, password: string, recaptcha?: string) {
        const data = {
            query: queries.Login,
            variables: {
                email,
                password,
                recaptcha,
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

    static async register(email: string, password: string, recaptcha?: string) {
        const data = {
            query: mutations.RegisterUser,
            variables: {
                email,
                password,
                recaptcha,
            },
        };

        return AuthApi.sendPlatfromRequest(data);
    }

    static async requestPasswordReset(email: string, recaptcha?: string) {
        const data = {
            query: mutations.RequestPasswordReset,
            variables: {
                email,
                recaptcha,
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

    static async changePassword({
        password,
        passwordConfirmation,
        oldPassword,
    }: {
        password: string;
        passwordConfirmation: string;
        oldPassword: string;
    }) {
        const data = {
            query: mutations.ChangePassword,
            variables: {
                password,
                passwordConfirmation,
                oldPassword,
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

    static async resendVerificationEmail(email: string) {
        const data = {
            query: mutations.ResendVerifyEmail,
            variables: {
                email,
            },
        };

        return AuthApi.sendPlatfromRequest(data);
    }

    static async deleteAccount() {
        const data = {
            query: mutations.DeleteAccount,
        };

        return AuthApi.sendPlatfromRequest(data);
    }
}
