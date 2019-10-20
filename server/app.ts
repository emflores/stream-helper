import express from "express";
import {TileProps} from "../types/types";
import {generate} from "./plugins/excuse-generator/generate-excuse";
import socketio from "socket.io"
import cors from "cors";

const app = express();
const port = 8080;

// middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))

// TODO: remove this require
const httpServer = require("http").Server(app);
const io = socketio.listen(httpServer, {
    origins: "http://localhost:3000"
});

httpServer.listen(port);

const mockTiles: TileProps[] = [
    {
        displayName: "Generate Excuse",
        endpoint: "/plugin/excuse/generate"
    }
]

app.get( "/api/tiles", ( req, res ) => {
    res.json({
        tiles: mockTiles,
    });
});

app.post("/plugin/excuse/generate", (req, res) => {
    generate(io)

    res.json({});
});

io.on('connection', (s) => {
    console.log("new client connected")
});