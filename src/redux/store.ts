import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

//FeactureAPIs
import { chatbotApi } from "./features/chatbot-api";

export const store = configureStore({
  reducer: {
    [chatbotApi.reducerPath]: chatbotApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatbotApi.middleware),
});

setupListeners(store.dispatch);
