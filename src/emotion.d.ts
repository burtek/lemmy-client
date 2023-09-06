import '@emotion/react';


declare module '@emotion/react' {
    export interface Theme {
        spacing: (factor: number, ...factors: number[]) => string;
    }
}
