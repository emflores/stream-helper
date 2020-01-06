import express from "express";
import {TileProps} from "../types/types";
import {generate} from "./plugins/slot-machine/generate";
import socketio from "socket.io"
import cors from "cors";
import userConfig from "./user-config.json"
import bodyParser from "body-parser";
import * as category from "./plugins/twitch/channel/category";
import * as slobs from "./plugins/slobs/slobs";
import SockJS from "sockjs-client";

const app = express();
const port = 8080;
const slobsHost = "http://127.0.0.1:59650/api";

const PLUGINS_URL_MAP = new Map<string, string>(
    [
        ["SLOT_MACHINE", "/plugin/slot-machine/create"],
        ["SWITCH_CATEGORY", "/plugin/channel/category/change"],
        ["CHANGE_SCENE", "/plugin/scene/change"],
        ["AUDIO_SOURCE", "/plugin/audio-source/mute"]
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

// sockjs client for SLOBS
const sockjsClient = new SockJS(slobsHost);
const slobsReady = slobs.init(sockjsClient);

httpServer.listen(port);

app.get( "/api/tiles", async ( req, res ) => {
    await Promise.all([slobsReady])

    const allTiles = [
        ...userConfig.tiles,
        ...slobs.getTiles()
    ];

    const tiles = allTiles.map(tilesConfig => {
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

app.post("/plugin/channel/category/change", (req, res) => {
    category.change(req.body.subType)

    res.json({});
});

app.post("/plugin/scene/change", async (req, res) => {
    await Promise.all([slobsReady])

    try {
        await slobs.setScene(sockjsClient, req.body.subType);
    } catch(e) {
        console.log(e)

        res.status(500).send({
            message: "failed to change scene, sucks"
        })

        return;
    }

    res.json({});
});

app.post("/plugin/audio-source/mute", async (req, res) => {
    await Promise.all([slobsReady])

    try {
        await slobs.setMuted(sockjsClient, req.body.subType);
    } catch(e) {
        console.log(e)

        res.status(500).send({
            message: "failed to mute audio source, sucks"
        })

        return;
    }

    res.json({});
});

io.on('connection', (s) => {
    console.log("new client connected")
});