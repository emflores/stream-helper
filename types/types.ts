import { string } from "prop-types"

export interface AppContextProps {
    socket: SocketIOClient.Socket | null;
}

export interface TileProps {
    type: string;
    subType: string;
    endpoint: string;
    title: string;
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