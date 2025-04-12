import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
    registrationSuccess: false,
};

// Async Thunk for Registering User
export const registerUser = createAsyncThunk(
    '/auth/register',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/register',
                formData,
                {
                    withCredentials: true,
                }

            );
            return response.data; // Assuming the backend returns user data on successful registration
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data); // Return specific error from backend
            } else {
                return rejectWithValue(error.message); // Return generic error
            }
        }
    }
);
//login user
export const loginUser = createAsyncThunk(
    "/auth/login",
  
    async (formData) => {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );
  
      return response.data;
    }
  );
  

//logout user
export const logoutUser = createAsyncThunk(
    '/auth/logout',
    async () => {
        const response = await axios.post(
            'http://localhost:5000/api/auth/logout',{},
            {
                withCredentials: true,
            }
        );
        return response.data;
    }
);

//create async thunk 
export const checkAuth = createAsyncThunk(
    '/auth/checkauth',
    async () => {

        const response = await axios.get(
            'http://localhost:5000/api/auth/check-auth',
            {
                withCredentials: true,
                headers: {
                    'Cache-Control': 'no-store , no-cache, must-revalidate ,proxy-revalidate',

                }
            }
        );
        return response.data;
        // Assuming the backend returns user data on successful registration

    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Corrected setUser reducer
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload; // Fixed: Set isAuthenticated to true if payload exists
            state.error = null; // Clear any previous errors when setting user
            state.registrationSuccess = false; // Reset registration success on user set
        },
        // Reducer to clear the error state
        clearError: (state) => {
            state.error = null;
        },
        // Reducer to clear the registration success flag
        clearRegistrationSuccess: (state) => {
            state.registrationSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.registrationSuccess = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload; // Store the registered user data
                state.isAuthenticated = false; // Assuming registration implies being authenticated
                state.error = null;
                state.registrationSuccess = true;

            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || 'Registration failed';
                state.registrationSuccess = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.registrationSuccess = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                // console.log(action);

                state.isLoading = false;
                state.user =
                    (action.payload.success)
                        ? action.payload.user
                        : null;
                // Store the registered user data
                state.isAuthenticated = action.payload.success ? true : false; // Assuming registration implies being authenticated
                state.isAuthenticated = action.payload.success
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || 'Login failed';
                state.registrationSuccess = false;
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user =
                    (action.payload.success)
                        ? action.payload.user
                        : null;
                // Store the registered user data
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;

            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                // Store the registered user data
                state.isAuthenticated = false;
            });
    },
});

export const { setUser, clearError, clearRegistrationSuccess } = authSlice.actions;
export default authSlice.reducer;
