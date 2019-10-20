export interface AppContextProps {
    socket: SocketIOClient.Socket | null;
}

export interface TileProps {
    displayName: string;
    endpoint: string;
}

export interface GetTilesResp {
    tiles: TileProps[];
}

/**
 * Plugins
 */

export interface SlotMachineMessage {
    options: string[]
}