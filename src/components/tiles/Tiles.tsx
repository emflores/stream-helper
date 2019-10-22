import React from 'react';
import Tile from './Tile';
import { TileProps } from '../../../types/types';
import styled from 'styled-components'

interface Props {
    tiles: TileProps[];
}

const Tiles: React.FC<Props> = (props) => {
  return (
      <List>
        {props.tiles.map((tile) => (
          <ListItem key={`${tile.type}.${tile.subType}`}>
            <Tile tile={tile} />
          </ListItem>
        ))
        }
      </List>
  );
}

const List = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 25px;
`;

const ListItem = styled.li`
  display: flex;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin-right: 10px;
  overflow: hidden;
  background-color: #fff;
`;

export default Tiles;
