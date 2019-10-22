import React from 'react';
import Tile from './Tile';
import { TileProps } from '../../../types/types';
import styled from 'styled-components'
import _ from 'lodash';

interface Props {
    tiles: TileProps[];
}

const groupTiles = (tiles: TileProps[]): [string, TileProps[]][] => {
  const groupedItems = _.groupBy(tiles, "type");

  return Object.entries(groupedItems);
}

const Tiles: React.FC<Props> = (props) => {
  const groupedTiles = groupTiles(props.tiles)

  return (
    <GroupWrapper>
      {groupedTiles.map(([key, tiles]) => (
        <div>
          <h2>{key}</h2>
          <List>
            {tiles.map(tile => (
              <ListItem key={`${tile.type}.${tile.subType}`}>
                <Tile tile={tile} />
              </ListItem>
            ))}
          </List>
        </div>
      ))
      }
    </GroupWrapper>
  );
}

const GroupWrapper = styled.div`
  padding: 25px;
`;

const List = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
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
