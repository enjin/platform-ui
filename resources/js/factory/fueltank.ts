import { publicKeyToAddress } from '~/util/address';

export class DTOFuelTankFactory {
    public static buildFuelTank(fueltank: any): any {
        return {
            ...fueltank,
            owner: publicKeyToAddress(fueltank.owner.account.publicKey),
            tankId: fueltank.tankId.publicKey,
        };
    }

    public static forFuelTanks(fueltanksData: any): any {
        const fueltanks = fueltanksData.data.GetFuelTanks;

        return {
            items: fueltanks?.edges?.map((fueltank) => DTOFuelTankFactory.buildFuelTank(fueltank.node)),
            cursor: fueltanks.pageInfo?.hasNextPage ? fueltanks.pageInfo.endCursor : null,
        };
    }

    public static forFuelTank(fueltankData: any): any {
        const fueltank = fueltankData.data.GetFuelTank;

        return {
            items: [DTOFuelTankFactory.buildFuelTank(fueltank)],
            cursor: null,
        };
    }
}
