import React, {useEffect, useState} from 'react';
import SlotMachine from '../../../components/plugins/slot-machine/SlotMachine';
import { AppContext } from '../../../app-context';
import { SlotMachineMessage } from '../../../../types/types';
import { RouteProps } from 'react-router';
import queryString from "query-string";

const SlotMachinePlugin: React.FC<RouteProps> = props => {
  return (
    <AppContext.Consumer>
      {app => {
        if (!app.socket) {
          return null;
        }

        if (!props.location) {
          return null;
        }

        const parsedQuery = queryString.parse(props.location.search);

        if (!parsedQuery.subType || Array.isArray(parsedQuery.subType)) {
          return null;
        }

        return (
          <SlotMachinePluginInner socket={app.socket} subType={parsedQuery.subType} />
        )
      }}
    </AppContext.Consumer>
  );
}

interface ISlotMachinePluginInnter {
  socket: SocketIOClient.Socket;
  subType: string;
}

const SlotMachinePluginInner: React.FC<ISlotMachinePluginInnter> = (props) => {
  const [data, setData] = useState<{options: string[]}>({options: []});

  useEffect(() => {
    props.socket.on(`plugins/slot-machine/${props.subType}`, (data: SlotMachineMessage) => {
      setData({
        options: data.options,
      })
    })
  });

  return (
    <SlotMachine options={data.options} />
  )
}

export default SlotMachinePlugin;
