import { reducer as authReducer, sliceName as authSliceName } from './auth';
import { reducer as authorsReducer, sliceName as authorsSliceName } from './authors';
import { reducer as communitiesReducer, sliceName as communitiesSliceName } from './communities';
import { reducer as instancesReducer, sliceName as instancesSliceName } from './instances';
import { reducer as postsReducer, sliceName as postsSliceName } from './posts';


export const reducers = {
    [authSliceName]: authReducer,
    [authorsSliceName]: authorsReducer,
    [communitiesSliceName]: communitiesReducer,
    [instancesSliceName]: instancesReducer,
    [postsSliceName]: postsReducer
};
