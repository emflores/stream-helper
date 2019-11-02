import { TileStaticProps } from "../../../types/types";

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

let tileCache: TileStaticProps[] = [];
let obsReady: Promise<void>;
let requestCount = 0;
let requestCache: {[key: number]: RequestCache} = {};


const makeSlobsRequest = (resource: string, methodName: string): {} => {
    return {
        jsonrpc: '2.0',
        id: ++requestCount,
        method: methodName,
        params: { resource }
    }
}

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

const getScenes = (sock: WebSocket): Promise<RPCResult> => {
    return sendMessage(sock, {
        jsonrpc: '2.0',
        id: ++requestCount,
        method: "getScenes",
        params: {
            resource: "ScenesService"
        }
    })
}

const scenesToTiles = (scenes: GetScenesResponse[]): TileStaticProps[] => {
    return scenes.map(scene => ({
        type: "CHANGE_SCENE",
        title: scene.name,
        selected: false, // TODO: call getItems for scenes to get visibility
        subType: "",
    }));
}

const onOpen = (sock: WebSocket, resolve: (value: void) => void) => {
    const scenesPromise = getScenes(sock);

    Promise.all([scenesPromise]).then(([scenesResult]) => {
        tileCache = [
            ...scenesToTiles(scenesResult as GetScenesResponse[])
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

    return obsReady
}

export const getTiles = (): TileStaticProps[] => {
    return tileCache;
}