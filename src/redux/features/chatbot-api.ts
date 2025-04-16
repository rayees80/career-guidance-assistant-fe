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

interface checkPermistionI {
  redirect: string;
  status?: number | null;  
  student_id?: string | string[] | null;  
  permission_granted?: number | null;  
  error?: string;
  response?: string;
}

interface checkPermistionInputI { 
  status: number | string,
  student_id: string | string[],
  permission_granted?: number

}



interface ChatbotPromptI {
  query: string;
  current_service: string;
  invoked_tool: string;
  language: string;
  permission_granted: number;
  session_id: string;
  status: number;
  student_id: string;
}

interface ChatbotI {
  redirect: string;
  data?: {
    response?: string;
    has_section_options?: boolean;
    section_options?: any[];
    has_list_options?: boolean;
    list_options?: any[];
    has_jobs?: boolean;
    jobs_response_text?: string;
    jobs?: any[];
    cv_tool_invoked?: boolean;
    invoked_tool?: string;
    service_type?: string;
    session_id?: string;
  };
  error?: string;
  response?: string;
}

export const chatbotApi = createApi({
  reducerPath: "chatbotApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://org-constructed-nurses-sports.trycloudflare.com/career_assistant",
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
    getServices: builder.query<any, void>({
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
    downloadCV: builder.query<any, string>({
      query: (sessionid) => {
        return {
          url: `/download_cv/?session_id=${sessionid}`,
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

    PermistionCheck: builder.mutation<any, checkPermistionInputI>({
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
    VerifyStudent: builder.mutation<any, UserResponse>({
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
    SendServicePrompt: builder.mutation<any, queryStudentI>({
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
    chatbotPrompt: builder.mutation<any, ChatbotPromptI>({
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
  useDownloadCVQuery,
} = chatbotApi;
