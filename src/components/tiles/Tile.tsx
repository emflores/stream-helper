import React from 'react';
import {TileProps} from "../../../types/types";

interface Props {
    tile: TileProps;
}

const action = async (endpoint: string, subType: string): Promise<string> => {
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subType: subType,
      })
    });
    const json = await resp.json();
    return json;
}

const Tile: React.FC<Props> = (props) => {
  // TODO: see what the idiomatic way binding is with FC
  return (
    <button onClick={action.bind(null, props.tile.endpoint, props.tile.subType)}>
        {props.tile.title}
    </button>
  );
}

export default Tile;