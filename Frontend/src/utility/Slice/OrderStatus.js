import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { currentOrderStatus } from "../../Constants/Driver'sConstant";
import { FetchData } from "../fetchFromAPI";

// 🔹 Async thunk for updating status
export const updateOrderStatusAsync = createAsyncThunk(
  "orderStatus/updateOrderStatusAsync",
  async ({ appointmentId, status }, { rejectWithValue }) => {
    try {
      const response = await FetchData(
        `order/update-order-status/${appointmentId}`,
        "post",
        { status }
      );
      console.log(response);

      return response.data.data; // contains updated order with new status
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// orderStatusSlice.js
export const fetchOrderById = createAsyncThunk(
  "orderStatus/fetchOrderById",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await FetchData(
        `order/get-order-details/${appointmentId}`, // 🔹 make sure this endpoint exists
        "get"
      );
      console.log(response);
      return response.data.data; // this will have `status`
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  steps: currentOrderStatus.map((s) => ({ ...s, completed: false })), // ✅ initialize steps
  loading: false,
  error: null,
};

const orderStatusSlice = createSlice({
  name: "orderStatus",
  initialState,
  reducers: {
    setSteps: (state, action) => {
      state.steps = action.payload.map((step) => ({
        ...step,
        completed: step.completed ?? false,
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOrderStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        console.log("UPDATE RESPONSE", action.payload);
        const updatedStatus = action.payload.status; // backend status

        const statusIndex = currentOrderStatus.findIndex((s) =>
          updatedStatus.toLowerCase().includes(s.status.toLowerCase())
        );

        if (statusIndex !== -1) {
          // mark completed up to current index
          state.steps = state.steps.map((step, idx) => ({
            ...step,
            completed: idx <= statusIndex,
          }));
        }
      })
      .addCase(updateOrderStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update step";
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        const order = action.payload;
        console.log(order);
        const statusIndex = currentOrderStatus.findIndex(
          (s) => s?.status?.toLowerCase() === order?.status?.toLowerCase()
        );

        state.steps = currentOrderStatus.map((step, idx) => ({
          ...step,
          completed: idx <= statusIndex, // ✅ mark all up to current status
        }));
      });
  },
});

export const { setSteps } = orderStatusSlice.actions;
export default orderStatusSlice.reducer;
