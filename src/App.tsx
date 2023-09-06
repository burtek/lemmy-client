import type { FC } from 'react';
import { useEffect, useMemo } from 'react';

import { Feed } from './Feed';
import { LoadingScreen } from './LoadingScreen';
import { LoginForm } from './Login';
import { isIdle, isNotCompleted } from './data/fetch_status';
import { selectors as authSelectors } from './data/reducers/auth';
import { actions as instancesActions, selectors as instancesSelectors } from './data/reducers/instances';
import { getInitialPostState, actions as postActions } from './data/reducers/posts';
import { useAppDispatch, useAppSelector } from './data/store-utils';


const App: FC = () => {
    const dispatch = useAppDispatch();

    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);
    const instance = useAppSelector(authSelectors.selectInstance);

    const instancesLoadingStatus = useAppSelector(instancesSelectors.selectInstancesStatus);
    const initialPostsLoadingStatus = useAppSelector(getInitialPostState);

    useEffect(() => {
        if (!instance) {
            return;
        }
        if (isIdle(instancesLoadingStatus)) {
            void dispatch(instancesActions.getInstances(instance));
        }
        if (isIdle(initialPostsLoadingStatus)) {
            void dispatch(postActions.getInitialPage());
        }
    }, [dispatch, instance, instancesLoadingStatus, initialPostsLoadingStatus]);

    const loadingScreenData = useMemo(() => [
        { text: 'Loading instances...', isLoading: isNotCompleted(instancesLoadingStatus) },
        { text: 'Loading posts...', isLoading: isNotCompleted(initialPostsLoadingStatus) }
    ], [instancesLoadingStatus, initialPostsLoadingStatus]);

    if (!isLoggedIn) {
        return <LoginForm />;
    }

    if (isNotCompleted(instancesLoadingStatus) || isNotCompleted(initialPostsLoadingStatus)) {
        return <LoadingScreen data={loadingScreenData} />;
    }

    return <Feed />;
};
App.displayName = 'App';
export default App;
