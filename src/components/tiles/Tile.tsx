import React, {useState, useCallback} from 'react';
import {TileProps} from "../../../types/types";
import styled from 'styled-components'

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
  const [requestState, setRequestState] = useState<{
    isSending: boolean;
    error: boolean;
  }>({ isSending: false, error: false});

  const sendRequest = useCallback(async () => {
    try {
      await action(props.tile.endpoint, props.tile.subType)
    } catch(e) {
      setRequestState({
        isSending: false,
        error: true
      });
    }

    setRequestState({
      isSending: false,
      error: false
    });

  }, [props]);

  // TODO: see what the idiomatic way binding is with FC
  return (
    <Button onClick={sendRequest} error={requestState.error} selected={props.tile.selected}>
        {props.tile.title}
    </Button>
  );
}

const Button = styled.button<{error: boolean; selected: boolean;}>`
  height: 100%;
  width: 100%;
  background: none;
  outline: none;
  color: ${props => props.error ? "#bb0000" : "#000"};
  font-weight: bold;
  border: ${props => props.selected ? "solid 1px black" : "solid 1px red"};

  &:hover {
    cursor: pointer;
  }

  &:active {
    color: #fff;
    background-color: #4bb543;
  }
`;

export default Tile;