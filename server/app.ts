import express from "express";
import {TileProps} from "../types/types";

const app = express();
const port = 8080;

const mockTiles: TileProps[] = [
    {
        displayName: "greenie996alt2",
        endpoint: "/greenie/dosomeaction"
    }
]

app.get( "/api/tiles", ( req, res ) => {
    res.json({
        tiles: mockTiles,
    });
});

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
});