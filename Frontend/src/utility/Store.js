import { configureStore } from "@reduxjs/toolkit";
import UserInfoSlice from "./Slice/UserInfoSlice";
import AllOrderList from "./Slice/AllOrdersSlice";
import AllAppointmentsSlice from "./Slice/AllAppointmentsSlice";
import OrderStatusSlice from "./Slice/OrderStatus"; // ✅ import new slice

const store = configureStore({
  reducer: {
    UserInfo: UserInfoSlice,
    AllOrders: AllOrderList,
    AllAppointments: AllAppointmentsSlice,
    orderStatus: OrderStatusSlice, // ✅ add reducer
  },
});

export default store;
