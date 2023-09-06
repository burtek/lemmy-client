import type { Theme } from '@emotion/react';


const spacingFactor = 8;

export const theme: Theme = {
    spacing(factor, ...factors) {
        return [factor, ...factors].map(num => `${spacingFactor * num}px`).join(' ');
    }
};
