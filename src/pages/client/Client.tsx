import React, {useState, useEffect} from 'react';
import Tiles from '../../components/tiles/Tiles';
import { GetTilesResp } from '../../../types/types';
import styled from 'styled-components';

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
        <Backdrop>
            <Tiles tiles={data.tiles} />
        </Backdrop>
    );
}

const Backdrop = styled.div`
    background-color: #772ce8;
    height: 100%;
    width: 100%;
`;

export default Client;
