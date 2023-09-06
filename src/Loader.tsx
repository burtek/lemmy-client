import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';


const rotation = keyframes({
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
});
const rotationBack = keyframes({
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(-360deg)' }
});

export const Loader = styled.span(({ theme }) => ({
    width: theme.spacing(6),
    height: theme.spacing(6),
    borderRadius: '50%',
    display: 'inline-block',
    position: 'relative',
    border: `${theme.spacing(0.75)} solid`,
    borderColor: '#FFF #FFF transparent transparent',
    boxSizing: 'border-box',
    animation: `${rotation} 1s linear infinite`,
    '&::after,&::before': {
        content: '""',
        boxSizing: 'border-box',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: 'auto',
        border: `${theme.spacing(0.75)} solid`,
        borderColor: 'transparent transparent #FF3D00 #FF3D00',
        width: theme.spacing(5),
        height: theme.spacing(5),
        borderRadius: '50%',
        animation: `${rotationBack} 0.5s linear infinite`,
        transformOrigin: 'center center'
    },
    '&::before': {
        width: theme.spacing(4),
        height: theme.spacing(4),
        borderColor: '#FFF #FFF transparent transparent',
        animation: `${rotation} 1.5s linear infinite`
    }
}));
