import socketio from "socket.io";
import userConfig from "../../user-config.json";

export const generate = (io: socketio.Server, subType: string) => {
    const tile = userConfig.tiles.find((tile) => tile.subType === subType);

    if (!tile) {
        // TODO: handle this
        return
    }

    const shuffled = shuffleOptions(tile.options);

    // TODO: figure out how to share these constants with the client
    io.sockets.emit(`plugins/slot-machine/${tile.subType}`, {
        // TODO: Shuffle list, then take first 5
        options: shuffled.slice(0, Math.max(5, shuffled.length))
    })
};

function shuffleOptions(options: string[]): string[] {
    const copy = options.slice()

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }

    return copy
}