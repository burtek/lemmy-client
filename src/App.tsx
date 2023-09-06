import type { FC } from 'react';
import { useEffect, useMemo } from 'react';

import { Feed } from './Feed';
import { LoadingScreen } from './LoadingScreen';
import { LoginForm } from './Login';
import { isIdle, isNotCompleted } from './data/fetch_status';
import { selectors as authSelectors } from './data/reducers/auth';
import { actions as instancesActions, selectors as instancesSelectors } from './data/reducers/instances';
import { useAppDispatch, useAppSelector } from './data/store-utils';


const App: FC = () => {
    const dispatch = useAppDispatch();

    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);
    const instance = useAppSelector(authSelectors.selectInstance);

    const instancesLoadingStatus = useAppSelector(instancesSelectors.selectInstancesStatus);

    useEffect(() => {
        if (!instance) {
            return;
        }
        if (isIdle(instancesLoadingStatus)) {
            void dispatch(instancesActions.getInstances(instance));
        }
    }, [dispatch, instance, instancesLoadingStatus]);

    const loadingScreenData = useMemo(() => [
        { text: 'Loading instances...', isLoading: isNotCompleted(instancesLoadingStatus) }
        // { text: 'Loading posts...', isLoading: isNotCompleted(initialPostsLoadingStatus) }
    ], [instancesLoadingStatus]);

    if (!isLoggedIn) {
        return <LoginForm />;
    }

    if (isNotCompleted(instancesLoadingStatus)) {
        return <LoadingScreen data={loadingScreenData} />;
    }

    return <Feed />;
};
App.displayName = 'App';
export default App;
