import React, {useState, useEffect} from 'react';
import Tiles from '../../components/tiles/Tiles';
import { GetTilesResp } from '../../../types/types';

const fetchTiles = async (): Promise<GetTilesResp> => {
    const result = await fetch('/api/tiles');
    const json = await result.json();

    return json;
}

const Client: React.FC = () => {
    const [data, setData] = useState<GetTilesResp>({ tiles: [] });

    useEffect(() => {
        fetchTiles().then(resp => setData({tiles: resp.tiles}))
    }, []);

    return (
        <Tiles tiles={data.tiles} />
    );
}

export default Client;
