import React from 'react';
import styled from 'styled-components'

interface Props {
    options: string[];
    isVisible: boolean;
}

// TODO: Figure out slot machine animation
const SlotMachine: React.FC<Props> = (props) => {
    if (!props.isVisible) {
        return null;
    }

    if (!props.options.length) {
        return null
    }

    return (
        <Paragraph>
            {props.options[0]}
        </Paragraph>

    );
}

export default SlotMachine;

const Paragraph = styled.div`
    font-size: 40px;
    color: #772ce8;
    font-weight: bold;
    background-color: #fff;
    text-align: center;
`;