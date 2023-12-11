import { publicKeyToAddress } from '~/util/address';

export default class Royalty {
    static getRoyaltyBeneficiary(item: any) {
        return publicKeyToAddress(item?.royalty?.beneficiary);
    }

    static getRoyaltyPercentage(item: any) {
        if (item?.royalty?.percentage) {
            return item.royalty.percentage;
        }

        return 0;
    }
}
