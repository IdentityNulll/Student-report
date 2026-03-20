import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const getProfileEndpoint = (role, id) => {
  switch (role) {
    case "TEACHER":
      return `/teachers/${id}`;
    case "STUDENT":
      return `/student/${id}`;
    default:
      return null;
  }
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const authUser = getState().auth.user;

      if (!authUser?.id || !authUser?.role) {
        return rejectWithValue("User info not found");
      }

      const endpoint = getProfileEndpoint(authUser.role, authUser.id);

      if (!endpoint) {
        return rejectWithValue("Invalid user role");
      }

      const res = await api.get(endpoint);
      const user = res.data?.data || {};

      return user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const authUser = getState().auth.user;

      if (!authUser?.id) {
        return rejectWithValue("User ID not found");
      }

      const res = await api.put(`/user/update/${authUser.id}`, payload);
      console.log(res)
      return res.data?.data || payload;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    updating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // update
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.data = {
          ...state.data,
          ...action.payload,
        };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Failed to update profile";
      });
  },
});

export default profileSlice.reducer;