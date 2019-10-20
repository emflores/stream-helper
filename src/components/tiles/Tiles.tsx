import React from 'react';
import Tile from './Tile';
import { TileProps } from '../../../types/types';

interface Props {
    tiles: TileProps[];
}

const Tiles: React.FC<Props> = (props) => {
  return (
      <ul>
        {props.tiles.map((tile) => (
            <Tile tile={tile} />
        ))
        }
      </ul>
  );
}

export default Tiles;
