import React from 'react';
import Tile from './Tile';
import { TileProps } from '../../../types/types';
import styled from 'styled-components'

interface Props {
    tiles: TileProps[];
}

const Tiles: React.FC<Props> = (props) => {
  return (
      <ListWrapper>
        {props.tiles.map((tile) => (
            <Tile tile={tile} key={`${tile.type}.${tile.subType}`} />
        ))
        }
      </ListWrapper>
  );
}

const ListWrapper = styled.ul`
  display: flex;
`;

export default Tiles;
