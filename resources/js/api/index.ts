import { useAppStore } from '~/store';
import { HttpMethods } from '~/types/types.enums';
import mutations from '~/api/mutations';
import snackbar from '~/util/snackbar';

export class ApiService {
    protected static async reloadCsrf() {
        return (await fetch('/')).text().then((html) => {
            const document = new DOMParser().parseFromString(html, 'text/html');
            const token = document.querySelector('meta[name=csrf-token]')?.getAttribute('content');

            if (token) {
                window.document.querySelector('meta[name=csrf-token]')?.setAttribute('content', token);

                return true;
            }

            return false;
        });
    }

    protected static async request({
        url,
        data = {},
        headers = {},
        method = HttpMethods.POST,
        credentials = 'omit',
        mode = 'cors',
        nest = true,
    }: {
        url: string;
        data?: Record<string, unknown>;
        headers?: Record<string, unknown>;
        method?: HttpMethods;
        credentials?: 'omit' | 'same-origin' | 'include';
        mode?: 'cors' | 'no-cors' | 'same-origin' | 'navigate';
        nest?: boolean;
    }): Promise<any> {
        let body: string | null = null;
        const fullUrl = url;
        const csrf = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        if (Object.keys(data).length > 0) {
            body = JSON.stringify(data);
        }

        if (!useAppStore().isMultiTenant) {
            headers.Authorization = useAppStore().config.authorization_token;
        } else {
            headers['X-CSRF-TOKEN'] = csrf;
        }

        const resp = await fetch(fullUrl, {
            method,
            body,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...headers,
            } as HeadersInit,
            credentials,
            mode,
        });

        if (resp.status === 419 && nest && useAppStore().isMultiTenant) {
            if (await this.reloadCsrf()) {
                return this.request({ url, method, data, headers });
            }
        }

        if (resp.status === 204) return null;

        if (resp.status === 401) {
            useAppStore().clearLogin();
            snackbar.error({ title: 'Unauthorized', text: 'Session expired, try to sign in again' });
            throw { field: 'Error', message: 'Unauthorized' };
        }

        if (resp.status >= 400 && resp.status < 600) {
            throw resp as unknown as Error;
        }

        return resp.json();
    }

    static async sendPlatformRequest(data: Record<string, unknown>, schema: string = ''): Promise<any> {
        const appStore = useAppStore();

        return new Promise((resolve, reject) => {
            if (!appStore.config.url) {
                reject({ field: 'Error', message: 'No URL provided' });
            }

            ApiService.request({
                url: `${appStore.config.url}graphql${schema}`,
                data,
                credentials: appStore.isMultiTenant ? 'include' : 'omit',
            }).then((res: any) => {
                if (res.errors) {
                    const message = res.errors[0].message;
                    if (message === 'validation') {
                        const error = res.errors[0].extensions?.validation;
                        const errors = Object.keys(error).map((key) => {
                            return {
                                field: key,
                                message: error[key][0],
                            };
                        });
                        reject(errors);
                    } else {
                        reject({ field: 'Error', message });
                    }
                }

                if (res.field == 'Error') {
                    reject(res);
                }

                resolve(res);
            });
        });
    }

    static async fetchURL(url: URL) {
        return ApiService.request({
            url: `${url}.well-known/enjin-platform.json`,
            method: HttpMethods.GET,
            credentials: undefined,
            mode: import.meta.env.PROD ? 'cors' : undefined,
        });
    }

    static async freeze(freezeData: Record<string, unknown>) {
        const data = {
            query: mutations.Freeze,
            variables: {
                collectionId: freezeData.collectionId,
                freezeType: freezeData.freezeType,
                tokenId: freezeData.tokenId,
                freezeState: freezeData.freezeState,
                collectionAccount: freezeData.collectionAccount,
                tokenAccount: freezeData.tokenAccount,
                idempotencyKey: freezeData.idempotencyKey,
                skipValidation: freezeData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async thaw(thawData: Record<string, unknown>) {
        const data = {
            query: mutations.Thaw,
            variables: {
                collectionId: thawData.collectionId,
                freezeType: thawData.freezeType,
                tokenId: thawData.tokenId,
                collectionAccount: thawData.collectionAccount,
                tokenAccount: thawData.tokenAccount,
                idempotencyKey: thawData.idempotencyKey,
                skipValidation: thawData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async batchMint(batchMintData: Record<string, unknown>) {
        const data = {
            query: mutations.BatchMint,
            variables: {
                collectionId: batchMintData.collectionId,
                recipients: (batchMintData.recipients as any[]).map((recipient: any) => {
                    delete recipient.mintType;
                    return recipient;
                }),
                idempotencyKey: batchMintData.idempotencyKey,
                skipValidation: batchMintData.skipValidation,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }

    static async batchTransfer(batchTransferData: Record<string, unknown>) {
        const data = {
            query: mutations.BatchTransfer,
            variables: {
                collectionId: batchTransferData.collectionId,
                idempotencyKey: batchTransferData.idempotencyKey,
                skipValidation: batchTransferData.skipValidation,
                signingAccount: batchTransferData.signingAccount,
                recipients: (batchTransferData.recipients as any[]).map((recipient: any) => {
                    delete recipient.transferType;
                    return recipient;
                }),
            },
        };
        return ApiService.sendPlatformRequest(data);
    }

    static async batchSetAttribute(batchSetAttributeData: Record<string, unknown>) {
        const data = {
            query: mutations.BatchSetAttribute,
            variables: {
                collectionId: batchSetAttributeData.collectionId,
                idempotencyKey: batchSetAttributeData.idempotencyKey,
                skipValidation: batchSetAttributeData.skipValidation,
                tokenId: batchSetAttributeData.tokenId,
                attributes: batchSetAttributeData.attributes,
            },
        };

        return ApiService.sendPlatformRequest(data);
    }
}
