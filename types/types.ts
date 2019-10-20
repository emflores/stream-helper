export interface TileProps {
    displayName: string;
    endpoint: string;
}

export interface GetTilesResp {
    tiles: TileProps[];
}