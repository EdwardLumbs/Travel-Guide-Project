import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice ({
    name: 'user',
    initialState,
    reducers: {
        signInStart : (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signInFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        signUpStart : (state) => {
            state.loading = true
        },
        signUpSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signUpFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        updatePasswordSuccess: (state, action) => {
            state.error = null
        },
        updatePasswordFailure: (state, action) => {
            state.error = action.payload
        },

        deleteUserStart: (state) => {
            state.loading = false
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        signOutUserStart: (state) => {
            state.loading = false
        },
        signOutUserSuccess: (state) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        signOutUserFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        }
    }
});

export const { 
    signInStart, 
    signInSuccess, 
    signInFailure,
    signUpStart, 
    signUpSuccess, 
    signUpFailure,
    updateUserFailure,
    updateUserStart,
    updateUserSuccess,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOutUserFailure,
    signOutUserStart,
    signOutUserSuccess,
    updatePasswordFailure,
    updatePasswordSuccess
} = userSlice.actions

export default userSlice.reducer;