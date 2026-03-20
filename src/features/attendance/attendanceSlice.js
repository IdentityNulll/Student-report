import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchAttendance = createAsyncThunk(
  "attendance/fetchAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const studentId = localStorage.getItem("id");

      if (!studentId) {
        return rejectWithValue("Student ID not found in localStorage");
      }

      const res = await api.get(`/attendance/by-userId/${studentId}`);

      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch attendance",
      );
    }
  },
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default attendanceSlice.reducer;
