import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const id = localStorage.getItem("id");
const role = localStorage.getItem("role");

const initialState = {
  user: id ? { id, role } : null,
  token: token || null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, id, role } = action.payload;

      state.user = { id, role };
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem("token", token);
      localStorage.setItem("id", id);
      localStorage.setItem("role", role);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
