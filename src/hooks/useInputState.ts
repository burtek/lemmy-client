import type { ChangeEventHandler } from 'react';
import { useState, useCallback } from 'react';


export const useInputState = (initialState = '') => {
    const [data, setData] = useState(initialState);
    const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        event => {
            setData(event.target.value);
        },
        []
    );
    return [data, onChange] as const;
};
