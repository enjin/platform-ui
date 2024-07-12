import { ApiService } from '.';
import mutations from './mutations';
import queries from './queries';

export class AuthApi {
    static async sendPlatfromRequest(data: Record<string, unknown>) {
        return ApiService.sendPlatformRequest(data, '/multi-tenant');
    }

    static async login(email: string, password: string, recaptcha?: string) {
        const query = recaptcha ? queries.LoginRecaptcha : queries.Login;
        const data = {
            query,
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
        const query = recaptcha ? mutations.RegisterUserRecaptcha : mutations.RegisterUser;

        const data = {
            query,
            variables: {
                email,
                password,
                recaptcha,
            },
        };

        return AuthApi.sendPlatfromRequest(data);
    }

    static async requestPasswordReset(email: string, recaptcha?: string) {
        const query = recaptcha ? mutations.RequestPasswordResetRecaptcha : mutations.RequestPasswordReset;
        const data = {
            query,
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

    static async deleteAccount(password: string) {
        const data = {
            query: mutations.DeleteAccount,
            varaiables: {
                password,
            },
        };

        return AuthApi.sendPlatfromRequest(data);
    }

    static async updateUser(email: string, password: string) {
        const data = {
            query: mutations.UpdateUser,
            variables: {
                email,
                password,
            },
        };

        return AuthApi.sendPlatfromRequest(data);
    }

    static async setUserAccounts(accounts: string) {
        const data = {
            query: mutations.UpdateUser,
            variables: {
                walletAccounts: accounts,
            },
        };

        return AuthApi.sendPlatfromRequest(data);
    }
}
