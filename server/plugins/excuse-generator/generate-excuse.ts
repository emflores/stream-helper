import config from "./excuses.json";
import socketio from "socket.io";

export const generate = (io: socketio.Server) => {
    // TODO: figure out how to share these constants with the client
    io.sockets.emit("plugins/generate-excuse", {
        // TODO: Shuffle list, then take first 5
        options: config.excuses.slice(0, 5)
    })
};