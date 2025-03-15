import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface DefaultI {
  redirect: string;
  data?: {
    message?: string;
  };
  error?: string;
}

interface UserResponse {
  user_response: string;
}
interface queryStudentI {
  query: string;
}

interface checkPermistion {
  student_id: string;
  attempts: number;
}

export const chatbotApi = createApi({
  reducerPath: "chatbotApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://characterization-titten-meter-sentence.trycloudflare.com/career_assistant",
    // 'http://localhost:8000/api/',
    credentials: "include",
    // prepareHeaders: (headers) => {
    //   const token = Cookies.get("token");
    //   if (token) {
    //     headers.set("authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  tagTypes: ["chatbotApi"],
  endpoints: (builder) => ({
    getServices: builder.query<DefaultI, void>({
      query: () => {
        return {
          url: `/services/`,
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
      },
    }),
    CheckStudent: builder.mutation<DefaultI, UserResponse>({
      query: (data) => {
        return {
          url: `/student_check/`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: data,
        };
      },
    }),

    PermistionCheck: builder.mutation<DefaultI, checkPermistion>({
      query: (data) => {
        return {
          url: `/grant_permission/`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: data,
        };
      },
    }),
    VerifyStudent: builder.mutation<DefaultI, UserResponse>({
      query: (data) => {
        return {
          url: `/verify_id/`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: data,
        };
      },
    }),
    SendServicePrompt: builder.mutation<DefaultI, queryStudentI>({
      query: (data) => {
        return {
          url: `/services/`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: data,
        };
      },
    }),
    chatbotPrompt: builder.mutation<DefaultI, queryStudentI>({
      query: (data) => {
        return {
          url: `/chatbot/`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: data,
        };
      },
    }),
  }),
});

export const {
  useCheckStudentMutation,
  useSendServicePromptMutation,
  useVerifyStudentMutation,
  usePermistionCheckMutation,
  useChatbotPromptMutation,
  useGetServicesQuery,
} = chatbotApi;
