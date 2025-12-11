import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api.js'

const userFromStorage = JSON.parse(localStorage.getItem('mm_user') || 'null')

//  LOGIN
export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/login', payload)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.errors ||     // express-validator errors
      err.response?.data?.message ||    // custom backend error message
      'Login failed'                    // fallback
    )
  }
})

//  REGISTER
export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/register', payload)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.errors ||     // express-validator errors
      err.response?.data?.message ||    // custom backend error message
      'Register failed'
    )
  }
})

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage?.user || null,
    token: userFromStorage?.token || null,
    status: 'idle',
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('mm_user')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('mm_user', JSON.stringify(action.payload))
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('mm_user', JSON.stringify(action.payload))
      })

      //  error handler
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'idle'
          state.error = action.payload      // array OR string
        }
      )

      //  loading handler
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading'
          state.error = null
        }
      )

      // fulfilled cleanup
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.status = 'idle'
          state.error = null
        }
      )
  }
})

export const { logout } = slice.actions
export default slice.reducer
