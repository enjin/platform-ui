export class DTOBeamFactory {
    public static buildBeam(beam: any): any {
        return {
            ...beam,
            ...beam.beam,
        };
    }

    public static forSingleUseCodes(beamData: any): any {
        const beams = beamData.data.GetSingleUseCodes;

        return {
            items: beams?.edges?.map((beam) => DTOBeamFactory.buildBeam(beam.node)),
            cursor: beams.pageInfo?.hasNextPage ? beams.pageInfo.endCursor : null,
            totalCount: beams.totalCount,
        };
    }

    public static forClaims(beamData: any): any {
        const beams = beamData.data.GetClaims;

        return {
            items: beams?.edges?.map((beam) => DTOBeamFactory.buildBeam(beam.node)),
            cursor: beams.pageInfo?.hasNextPage ? beams.pageInfo.endCursor : null,
        };
    }

    public static forBeam(beamData: any): any {
        const beam = beamData.data.GetBeam;

        return {
            items: [DTOBeamFactory.buildBeam(beam)],
            cursor: null,
        };
    }

    public static forBeams(beamsData: any): any {
        const beams = beamsData.data.GetBeams;

        return {
            items: beams?.edges?.map((beam) => DTOBeamFactory.buildBeam(beam.node)),
            cursor: beams.pageInfo?.hasNextPage ? beams.pageInfo.endCursor : null,
            totalCount: beams.totalCount,
        };
    }
}
