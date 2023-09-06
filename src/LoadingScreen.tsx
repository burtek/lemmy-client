import styled from '@emotion/styled';
import { Fragment } from 'react';

import { Loader } from './Loader';


const Container = styled.div(({ theme }) => ({
    position: 'absolute',
    width: '1080px',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',

    display: 'grid',
    gridTemplateColumns: '1fr min-content',
    gridAutoRows: 'min-content',
    gap: theme.spacing(2)
}));

export function LoadingScreen({ data }: { data: Array<{ text: string; isLoading: boolean }> }) {
    return (
        <Container>
            {data.map(({ text, isLoading }) => (
                <Fragment key={text}>
                    <div>{text}</div>
                    {isLoading ? <Loader /> : <div />}
                </Fragment>
            ))}
        </Container>
    );
}
LoadingScreen.displayName= 'LoadingScreen';
