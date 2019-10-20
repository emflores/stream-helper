import React from 'react';

interface Props {
    options: string[];
}

const SlotMachine: React.FC<Props> = (props) => {
    if (!props.options.length) {
        return null
    }

    return (
        <p>
            {props.options[0]}
        </p>
    );
}

export default SlotMachine;
