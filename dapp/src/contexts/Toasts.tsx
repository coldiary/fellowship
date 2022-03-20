import React, { Reducer, createContext, FC, useReducer, useMemo } from 'react';
import uniqueId from 'lodash/uniqueId';

import { Toast } from 'components/Toast';

export interface ToastOptions {
    message: string;
    duration?: number;
    overwrite?: boolean;
}

export interface ToastsContextState {
    toasts: Toast[];
}

export enum ToastsContextActionType {
    addToast = 'ADD_TOAST',
    removeToast = 'REMOVE_TOAST',
}

export type ToastsContextAction = {
    type: ToastsContextActionType.addToast;
    payload: {
        overwrite?: boolean;
        toast: Toast;
    };
} | {
    type: ToastsContextActionType.removeToast;
    payload: {
        id: string;
    }
}

export interface ToastsContextType extends ToastsContextState {
    showToast: (options: ToastOptions) => void;
}

const initialState: ToastsContextState = {
    toasts: [],
};

const reducer: Reducer<ToastsContextState, ToastsContextAction> = (state, action) => {
    switch (action.type) {
        case ToastsContextActionType.addToast:
            return { toasts: action.payload.overwrite ? [action.payload.toast] : [...state.toasts, action.payload.toast] };
        case ToastsContextActionType.removeToast:
            return { toasts: state.toasts.filter(t => t.id !== action.payload.id) };
        default:
            throw new Error();
    }
};

export const ToastsContext = createContext<ToastsContextType>({
    toasts: [],
    showToast: () => { /* */ },
});

export const ToastsContextProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const showToast = (options: ToastOptions) => {
        const { message, duration, overwrite } = { duration: 3000, ...options };
        const newId = uniqueId('toast-');
        console.log(newId, message, duration);
        dispatch({ type: ToastsContextActionType.addToast, payload: { overwrite, toast: { id: newId, message }}});
        setTimeout(() => dispatch({ type: ToastsContextActionType.removeToast, payload: { id: newId }}), duration);
    };

    const value = useMemo(() => ({ ...state, showToast }), [state]);

    return (
        <ToastsContext.Provider value={value}>
            {children}
        </ToastsContext.Provider>
    );
};
