import styled from '@emotion/styled';
import { useCallback } from 'react';

import { useAppDispatch } from './data';
import { actions as authActions } from './data/reducers/auth';
import { useInputState } from './hooks/useInputState';


const Form = styled.div(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    display: 'grid',
    gridTemplateColumns: 'max-content min-content',
    gap: theme.spacing(1),
    '& > button': { gridColumn: '1 / 3' }
}));

export function LoginForm() {
    const [instance, setInstance] = useInputState();
    const [username, setUsername] = useInputState();
    const [password, setPassword] = useInputState();

    const dispatch = useAppDispatch();

    const onLogin = useCallback(() => {
        const url = instance.includes('://') ? instance : `https://${instance}`;
        return dispatch(authActions.logIn({ username, password, instance: url }));
    }, [dispatch, username, password, instance]);

    return (
        <Form>
            <label htmlFor="instance">Instance</label>
            <input
                id="instance"
                value={instance}
                onChange={setInstance}
            />
            <label htmlFor="username">Username or email</label>
            <input
                id="username"
                value={username}
                onChange={setUsername}
            />
            <label htmlFor="pass">Password</label>
            <input
                id="pass"
                value={password}
                onChange={setPassword}
                type="password"
            />
            <button
                onClick={onLogin}
                type="button"
            >
                Login
            </button>
        </Form>
    );
}
LoginForm.displayName = 'LoginForm';
