import { TileStaticProps } from "../../../types/types";

// TODO: Break this out to smaller modules
// TODO: Import type defs from slobs e.g. https://github.com/stream-labs/streamlabs-obs/blob/eb702709/app/services/api/external-api/audio/audio.ts#L20

type Message = {
    id: number;
    [key: string]: any;
}

type RequestCache = {
    body: Message;
    resolve: (value: RPCReturnMessage) => void;
    reject: (e: Error) => void;
    completion: boolean;
}

type RPCReturnMessage = {
    jsonrpc: string;
    id: number;
    result: RPCResult;
}

type RPCResult = {} | GetScenesResponse[];

type GetScenesResponse = {
    _type: string;
    resourceId: string;
    id: string;
    name: string;
}

type GetAudioResourcesResponse = {
    _type: string;
    sourceId: string;
    resourceId: string;
    name: string;
    muted: boolean;
}

let tileCache: TileStaticProps[] = [];
let obsReady: Promise<void>;
let requestCount = 0;
let requestCache: {[key: number]: RequestCache} = {};

const sendMessage = (sock: WebSocket, message: Message): Promise<{}> => {
    return new Promise((resolve, reject) => {
        requestCache[message.id] = {
            body: message,
            resolve,
            reject,
            completion: false
        }

        sock.send(JSON.stringify(message))
    })
}

const makeRequest = (sock: WebSocket, method: string, resource: string): Promise<RPCResult> => {
    return sendMessage(sock, {
        jsonrpc: '2.0',
        id: ++requestCount,
        method,
        params: {
            resource,
        }
    })
}

const scenesToTiles = (scenes: GetScenesResponse[]): TileStaticProps[] => {
    return scenes.map(scene => {
        return {
            type: "CHANGE_SCENE",
            title: scene.name,
            selected: false, // TODO: call getItems for scenes to get visibility
            subType: scene.id,
        };
    });
}

const audioSourcesToTiles = (audioSources: GetAudioResourcesResponse[]): TileStaticProps[] => {
    return audioSources.map(audioSource => {
        console.log(audioSource)
        return {
            type: "AUDIO_SOURCE",
            title: audioSource.name,
            selected: !audioSource.muted,
            subType: audioSource.resourceId,
        };
    });
}

const onOpen = (sock: WebSocket, resolve: (value: void) => void) => {
    const scenesPromise = makeRequest(sock, "getScenes", "ScenesService");
    const audioSources = makeRequest(sock, "getSources", "AudioService");

    Promise.all([scenesPromise, audioSources]).then(([scenesResult, audioSourcesResult]) => {
        tileCache = [
            ...audioSourcesToTiles(audioSourcesResult as GetAudioResourcesResponse[]),
            ...scenesToTiles(scenesResult as GetScenesResponse[]),
        ]
        resolve()
    })
}

const onMessage = (e: MessageEvent) => {
    const message = JSON.parse(e.data);
    const request = requestCache[message.id];

    if (request) {
        if (message.error) {
            // TODO: this is not handled yet
            request.reject(message.error);
        } else {
            request.resolve(message.result);
        }

        delete requestCache[message.id];
    }

    // const result = message.result;
    // if (!result) return;
    // if (result._type === 'EVENT' && result.emitter === 'STREAM') {
    //   this.subscriptions[message.result.resourceId](result.data);
    // }
}

export const init = async (sock: WebSocket): Promise<void> => {
    obsReady = new Promise((resolve, reject) => {
        sock.onmessage = onMessage;
        sock.onopen = onOpen.bind(null, sock, resolve);
        sock.onerror = console.error
    })

    return obsReady;
}

// TODO: we only update tile state when the web server starts. we need to push state changes to the client side
//       consistently. Either:
//          * optimistic updates
//          * refresh tile state via websockets (just re-render everything any time any state changes)
export const getTiles = (): TileStaticProps[] => {
    return tileCache;
}

export const setScene = async (sock: WebSocket, id: string) => {
    const resp = await sendMessage(sock, {
        jsonrpc: '2.0',
        id: ++requestCount,
        method: "makeSceneActive",
        params: {
            resource: "ScenesService",
            args: [id]
        }
    });

    if (!resp) {
        throw new Error("failed to change scene")
    }
};

export const setMuted = async (sock: WebSocket, id: string) => {
    const resp = await sendMessage(sock, {
        jsonrpc: '2.0',
        id: ++requestCount,
        method: "setMuted",
        params: {
            resource: id,
            // TODO: pass and reverse state from front end
            args: [true]
        }
    });

    if (!resp) {
        throw new Error("failed to mute source")
    }
};