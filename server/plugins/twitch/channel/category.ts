import userConfig from "../../../user-config.json";
import secrets from "C:/Users/Michael/Documents/secrets.json";
import fetch from "node-fetch";


export const change = async (subType: string) => {
    if (!subType) {
        return;
    }

    // TODO: extract this to a utility
    const tile = userConfig.tiles.find((tile) => tile.type === "SWITCH_CATEGORY" && tile.subType === subType);

    if (!tile) {
        return
    }

    const resp = await fetch(`https://api.twitch.tv/kraken/channels/${userConfig.channelId}`, {
        method: "PUT",
        body: JSON.stringify({
            channel: {
                status: tile.streamTitle,
                game: tile.category,
            },
        }),
        headers: {
            "Authorization": secrets.oauth,
            "Accept": "application/vnd.twitchtv.v5+json",
            "Content-Type": "application/json",
            "Client-ID": secrets.clientId,
        },
    });

    const json = await resp.json();

    return;
}