import socketio from "socket.io";
import userConfig from "../../user-config.json";

export const generate = (io: socketio.Server, subType: string) => {
    const tile = userConfig.tiles.find((tile) => tile.subType === subType);

    if (!tile) {
        // TODO: handle this
        return
    }

    // TODO: figure out how to share these constants with the client
    io.sockets.emit(`plugins/slot-machine/${tile.subType}`, {
        // TODO: Shuffle list, then take first 5
        options: tile.options.slice(0, Math.max(5, tile.options.length))
    })
};