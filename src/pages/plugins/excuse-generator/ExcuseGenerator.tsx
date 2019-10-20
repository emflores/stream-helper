import React, {useEffect, useState} from 'react';
import SlotMachine from '../../../components/plugins/slot-machine/SlotMachine';
import { AppContext } from '../../../app-context';
import { tsPropertySignature } from '@babel/types';
import { SlotMachineMessage, AppContextProps } from '../../../../types/types';

const ExcuseGenerator: React.FC = () => {
  return (
    <AppContext.Consumer>
      {app => {
        if (app.socket === null) {
          return null;
        }

        return (
          <ExcuseGeneratorInner socket={app.socket} />
        )
      }}
    </AppContext.Consumer>
  );
}

const ExcuseGeneratorInner: React.FC<{socket: SocketIOClient.Socket}> = (props) => {
  const [data, setData] = useState<{options: string[]}>({options: []});

  useEffect(() => {
    props.socket.on("plugins/generate-excuse", (data: SlotMachineMessage) => {
      setData({
        options: data.options,
      })
    })
  });

  return (
    <SlotMachine options={data.options} />
  )
}

export default ExcuseGenerator;
