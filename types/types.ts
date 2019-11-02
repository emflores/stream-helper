import { string } from "prop-types"

export interface AppContextProps {
    socket: SocketIOClient.Socket | null;
}

export interface TileProps extends TileStaticProps {
    endpoint: string;

}

export interface TileStaticProps {
    title: string;
    selected: boolean;
    type: string;
    subType: string;
}

export interface SlotMachineConfigProps extends TileStaticProps {
    options: string[];
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