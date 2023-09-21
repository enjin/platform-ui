import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { u8aToHex, isHex, hexToU8a } from '@polkadot/util';
import { useAppStore } from '~/store';

const CANARY_NETWORK_ID = 9030;
const ENJIN_NETWORK_ID = 1110;

function getNetworkId(network: string): number {
    switch (network) {
        case 'canary':
            return CANARY_NETWORK_ID;
        default:
            return ENJIN_NETWORK_ID;
    }
}

export function publicKeyToAddress(publicKey: string): string {
    if (!publicKey) return '';

    try {
        return encodeAddress(publicKey, getNetworkId(useAppStore().config.network));
    } catch {
        return publicKey;
    }
}

export function addressToPublicKey(address: string) {
    if (!address) return '';

    try {
        return u8aToHex(decodeAddress(address));
    } catch {
        return address;
    }
}

export function isValidAddress(address: string): boolean {
    try {
        encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

        return true;
    } catch {
        return false;
    }
}

export function addressShortHex(publicKey: string) {
    const size = Math.floor(8 / 2);
    const address = publicKeyToAddress(publicKey);

    return `${address.slice(0, size + 2)}...${address.slice(-size)}`;
}

export function shortCode(code: string) {
    if (!code) return '';
    const size = Math.floor(8 / 2);

    return `${code.slice(0, size)}...${code.slice(-size)}`;
}
