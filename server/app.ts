import express from "express";
import {TileProps} from "../types/types";
import {generate} from "./plugins/slot-machine/generate";
import socketio from "socket.io"
import cors from "cors";
import userConfig from "./user-config.json"
import bodyParser from "body-parser";

const app = express();
const port = 8080;

const PLUGINS_URL_MAP = new Map<string, string>(
    [
        ["SLOT_MACHINE", "/plugin/slot-machine/create"]
    ]
)

// middleware
app.use(cors({
    origin: "*:*",
    credentials: true,
}))

app.use(bodyParser.json())

// TODO: remove this require
const httpServer = require("http").Server(app);
const io = socketio.listen(httpServer, {
    origins: "*:*"
});

httpServer.listen(port);

app.get( "/api/tiles", ( req, res ) => {
    const tiles = userConfig.tiles.map(tilesConfig => {
        return {
            ...tilesConfig,
            endpoint: PLUGINS_URL_MAP.get(tilesConfig.type)
        }
    })

    res.json({
        tiles,
    });
});

app.post("/plugin/slot-machine/create", (req, res) => {
    generate(io, req.body.subType)

    res.json({});
});

io.on('connection', (s) => {
    console.log("new client connected")
});