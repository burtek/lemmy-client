import { createAsyncThunk } from '@reduxjs/toolkit';
import type { EqualityFn } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import type { UseSelectorOptions } from 'react-redux/es/hooks/useSelector';

import type { AppDispatch, RootState } from './store';


export const useAppSelector: {
    <Selected = unknown>(selector: (state: RootState) => Selected, equalityFn?: EqualityFn<Selected>): Selected;
    <Selected = unknown>(selector: (state: RootState) => Selected, options?: UseSelectorOptions<Selected>): Selected;
} = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState;
    dispatch: AppDispatch;
    rejectValue: string;
}>();
