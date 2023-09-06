export const enum FetchStatus {
    IDLE = 'idle',
    IN_PROGRESS = 'in progress',
    SUCCESS = 'success',
    ERROR = 'error'
}

export const isIdle = (status: FetchStatus) => status === FetchStatus.IDLE;
export const isInProgress = (status: FetchStatus) => status === FetchStatus.IN_PROGRESS;
export const isSuccess = (status: FetchStatus) => status === FetchStatus.SUCCESS;
export const isError = (status: FetchStatus) => status === FetchStatus.ERROR;

export const isCompleted = (status: FetchStatus) => isSuccess(status) || isError(status);
export const isNotCompleted = (status: FetchStatus) => !isCompleted(status);
export const isBegun = (status: FetchStatus) => !isIdle(status);
