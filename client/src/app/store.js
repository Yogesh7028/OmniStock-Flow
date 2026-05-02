import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/users/userSlice";
import productReducer from "../features/products/productSlice";
import orderReducer from "../features/orders/orderSlice";
import paymentReducer from "../features/payments/paymentSlice";
import invoiceReducer from "../features/invoices/invoiceSlice";
import stockReducer from "../features/stock/stockSlice";
import notificationReducer from "../features/notifications/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    products: productReducer,
    orders: orderReducer,
    payments: paymentReducer,
    invoices: invoiceReducer,
    stock: stockReducer,
    notifications: notificationReducer,
  },
});
