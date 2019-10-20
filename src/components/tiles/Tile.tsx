import React from 'react';
import {TileProps} from "../../../types/types";

interface Props {
    tile: TileProps;
}

const action = async (endpoint: string): Promise<string> => {
    const resp = await fetch(endpoint);
    const json = await resp.json();
    return json;
}

const Tile: React.FC<Props> = (props) => {
  return (
    <button onClick={action.bind(null, props.tile.endpoint)}>
        {props.tile.displayName}
    </button>
  );
}

export default Tile;
