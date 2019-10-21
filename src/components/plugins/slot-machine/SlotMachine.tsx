import React from 'react';
import styled from 'styled-components'

interface Props {
    options: string[];
}

const SlotMachine: React.FC<Props> = (props) => {
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

const Paragraph = styled.p`
    font-size: 40px;
`;