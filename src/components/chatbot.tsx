"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChartSpline, Camera, Plane, Send, Bot, User2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChatbotPromptMutation } from "@/redux/features/chatbot-api";
import { useParams } from "next/navigation";
import Loading from "./loading/loader";
import { useRouter, usePathname } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from "@/context/language-context";

const FormSchema = z.object({
  prompt: z.string().min(1, {
    message: "prompt is required",
  }),
});

// Define proper types for the chat messages
interface UserMessage {
  message: string;
  type: "Guest" | "Student" | "user";
}

interface BotMessage {
  message: {
    response: string;
    section_options?: string[];
    list_options?: string[];
    jobs?: string[] | JobsI[];
    // Update to handle both string and object arrays
  };
  type: "bot";
}

type ChatMessage = UserMessage | BotMessage;

interface JobsI {
  company: string;
  description: string;
  location: string;
  url: string;
  title: string;
  "date posted": string;
}

function ChatBot() {
  const { language } = useLanguage();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [service, setService] = useState<string | null>(null);
  const [firstResponse, setFirstResponse] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobsI[] | null>([]);
  const [selectionOption, setSelectionOption] = useState<string | null>(null);
  const [listOption, setlistOption] = useState<string | null>(null);
  const [isStudent, setIsStudent] = useState<string | null>(null);
  // const [languagechat, setLanguagechat] = useState<string | null>(null);

  console.log("chatHistory", chatHistory);
  console.log("jobs", jobs);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      router.push(pathname); // Stay on the same page
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  const [
    chatbotPrompt,
    {
      data: chatbotResponse,
      error: chatbotError,
      isSuccess: isChatbotResponseSuccess,
      isLoading: chatbotIsLoading,
    },
  ] = useChatbotPromptMutation();
  const { locale, slug } = useParams();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  // Fix hydration issues by setting client-side state after component mounts
  useEffect(() => {
    setIsClient(true);
    setService(localStorage.getItem("service"));
    setFirstResponse(localStorage.getItem("response"));
    setJobs(
      JSON.parse(localStorage.getItem("jobslisting") || "null") as
      | JobsI[]
      | null
    );
    setSelectionOption(localStorage.getItem("section_options"));
    setlistOption(localStorage.getItem("list_options"));
    setIsStudent(localStorage.getItem("student_id"));
  }, []);


  console.log('listOption', listOption);
  // Add this useEffect to handle successful responses
  useEffect(() => {
    if (isChatbotResponseSuccess && chatbotResponse) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { message: chatbotResponse, type: "bot" } as BotMessage,
      ]);

      // Use safer scrolling mechanism
      if (typeof window !== "undefined") {
        window.requestAnimationFrame(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        });
      }
    }
  }, [isChatbotResponseSuccess, chatbotResponse]);

  const formatText = (text: string | null) => {
    if (!text) return <div></div>;

    // Remove outer quotes if present
    let processedText = text.startsWith('"') && text.endsWith('"')
      ? text.substring(1, text.length - 1)
      : text;

    // Replace all variants of newline characters
    processedText = processedText
      .replace(/\\n\\n/g, "\n\n")  // Replace literal "\n\n" with actual double line breaks
      .replace(/\\n/g, "\n")       // Replace literal "\n" with actual line breaks
      .replace(/\/n\/n/g, "\n\n")  // Replace "/n/n" with actual double line breaks
      .replace(/\/n/g, "\n");      // Replace "/n" with actual line breaks

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 " {...props} />,
          p: ({ node, ...props }) => <p className="" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          em: ({ node, ...props }) => <strong {...props} /> // Convert emphasis to strong for your *bold* text
        }}
      >
        {processedText}
      </ReactMarkdown>
    );
  };

  // Helper function to process bold text
  const renderTextWithBold = (text: string, keyPrefix: string) => {
    const parts = [];
    let lastIndex = 0;
    const boldRegex = /\*\*(.*?)\*\*/g;
    let boldMatch;

    // Create an array of text parts with bold elements
    while ((boldMatch = boldRegex.exec(text)) !== null) {
      // Add text before the bold part
      if (boldMatch.index > lastIndex) {
        parts.push(text.substring(lastIndex, boldMatch.index));
      }
      // Add the bold part (without the ** markers)
      parts.push(
        <strong key={`${keyPrefix}-bold-${boldMatch.index}`}>
          {boldMatch[1]}
        </strong>
      );
      lastIndex = boldMatch.index + boldMatch[0].length;
    }

    // Add any remaining text after the last bold part
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // useEffect(() => {
  //   const storedLanguage = JSON.parse(
  //     localStorage.getItem("language") || '"english"'
  //   );

  //   setLanguagechat(storedLanguage);
  // }, []);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      });
    }

    setChatHistory((prevHistory) => [
      ...prevHistory,
      {
        message: data.prompt,
        type: slug === "guest" ? "Guest" : "Student",
      } as UserMessage,
    ]);

    try {
      // Only access localStorage when in client environment
      if (typeof window !== "undefined") {
        const obj = {
          query: data.prompt,
          student_id: localStorage.getItem("student_id") || "",
          status: parseInt(localStorage.getItem("status") || "0"),
          permission_granted: parseInt(
            localStorage.getItem("permission") || "0"
          ),
          language: language,
          session_id: localStorage.getItem("sessionid") || "0",
          current_service: localStorage.getItem("service") || "0",
          invoked_tool: localStorage.getItem("invoked_tool") || "0",
        };
        chatbotPrompt(obj);
      }

      form.reset();
    } catch (e) {
      console.log(e);
    }
  };

  // Render a skeleton or nothing until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Type guard to check if a chat message is a bot message
  const isBotMessage = (chat: ChatMessage): chat is BotMessage => {
    return chat.type === "bot";
  };

  // Type guard to check if a chat message is a user message
  const isUserMessage = (chat: ChatMessage): chat is UserMessage => {
    return chat.type !== "bot";
  };

  // Helper function to check if an item is a JobsI object
  const isJobObject = (item: any): item is JobsI => {
    return (
      typeof item === "object" &&
      item !== null &&
      "title" in item &&
      "company" in item
    );
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8 overflow-hidden mb-[125px] ">
        {/* Welcome Section */}

        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-gray-800 rounded-2xl mx-auto flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold">{service}</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            I am here to help you ...
          </p>
          <div className="w-full" style={{ padding: "0px 100px" }}>
            <div
              className={`flex items-center gap-2 my-2 ${language === 'arabic' && "flex-row-reverse"
                } `}
            >
              <div className={``}>
                <div className={`flex items-center gap-2 p-2`}>
                  <Bot className="w-8 h-8" /> BOT
                  <div
                    className={`p-2 bg-white rounded-tr-[10px] rounded-bl-[10px]`}
                  >
                    <p className={` text-left text-gray-800 mb-2 p-2`}>
                      {formatText(firstResponse)}
                    </p>
                    <div>
                      {listOption &&
                        JSON.parse(listOption)?.map((option: string) => (
                          <Button
                            key={option}
                            className="mx-2 bg-blue-500 text-white rounded-lg px-4 py-2 mt-2 flex flex-col text-pretty"
                            style={{ height: "auto" }}
                            onClick={() => {

                              form.setValue("prompt", option);
                              form.handleSubmit(onSubmit)();
                            }}
                          >
                            {option}
                          </Button>
                        ))}

                      {selectionOption &&
                        JSON.parse(selectionOption)?.map((option: string) => (
                          <Button
                            key={option}
                            className="mx-2  bg-slate-500 text-white rounded-lg px-4 py-2 mt-2 flex flex-col  text-pretty "
                            style={{ height: "auto" }}
                            onClick={() => {
                              form.setValue("prompt", option);
                              form.handleSubmit(onSubmit)();
                            }}
                          >
                            {option}
                          </Button>
                        ))}

                      {/* show jobs in table */}
                      {jobs && jobs.length > 0 && (
                        <div className="flex flex-col">
                          <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                              <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead>
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                                      >
                                        Title
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                                      >
                                        Company
                                      </th>
                                      {/* <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase w-[100px]"
                                >
                                Description
                                </th> */}
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                                      >
                                        Location
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                                      >
                                        Date Posted
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                                      >
                                        URL
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {jobs.map((job: JobsI) => (
                                      <tr
                                        className="odd:bg-white even:bg-gray-100"
                                        key={job.title}
                                      >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 max-w-[160px] text-pretty ">
                                          {isJobObject(job) ? job.title : job}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                          {isJobObject(job) ? job.company : ""}
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 w-[100px]">
                                  {job.description}
                                </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                          {isJobObject(job) ? job.location : ""}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                          {job?.['date posted']}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                          <a
                                            href={job.url}
                                            className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                                          >
                                            visit link
                                          </a>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 chatbotbg">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 my-2 ${chat.type === "bot" ? "justify-start" : "justify-end"
                }`}
            >
              <div
                className={`flex items-center gap-2 p-2 ${language === "arabic" ? "flex-row-reverse" : "" } `}
              >
                {chat.type === "bot" ? (
                  <Bot className="w-8 h-8" />
                ) : (
                  <User2 className="w-8 h-8" />
                )}
                {chat.type === "bot"
                  ? "BOT"
                  : isStudent === "null"
                    ? "Guest"
                    : "Student"}
                <p
                  className={`p-2 ${chat.type === "bot"
                    ? "bg-white text-gray-800 rounded-tr-[10px] rounded-bl-[10px]"
                    : "bg-blue-500 text-white rounded-tl-[10px] rounded-br-[10px]"
                    }`}
                >
                  {isBotMessage(chat)
                    ? formatText(chat.message.response)
                    : formatText(chat.message)}

                  {isBotMessage(chat) &&
                    chat.message.section_options?.map((option: string) => (
                      <Button
                        key={option}
                        style={{ height: "auto" }}
                        className="mx-2 bg-slate-500 text-white rounded-lg px-4 py-2 mt-2 flex flex-col text-pretty"
                        onClick={() => {
                          form.setValue("prompt", option);
                          form.handleSubmit(onSubmit)();
                        }}
                      >
                        {option}
                      </Button>
                    ))}

                  {isBotMessage(chat) &&
                    chat.message.list_options?.map((option: string) => (
                      <Button
                        key={option}
                        className="mx-2 bg-blue-500 text-white rounded-lg px-4 py-2 mt-2 flex flex-col  text-pretty"
                        style={{ height: "auto" }}
                        onClick={() => {

                          form.setValue("prompt", option);
                          form.handleSubmit(onSubmit)();
                        }}
                      >
                        {option}
                      </Button>
                    ))}

                  {/* Render jobs as a list of buttons */}
                  {isBotMessage(chat) &&
                    chat.message.jobs &&
                    chat.message.jobs.length > 0 && (
                      <>
                        <div className="flex flex-col">
                          <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                              <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead>
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                                      >
                                        Title
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                                      >
                                        Company
                                      </th>

                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                                      >
                                        Location
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                                      >
                                        Date Posted
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                                      >
                                        URL
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {isBotMessage(chat) &&
                                      chat.message.jobs &&
                                      chat.message.jobs.map((job, jobIndex) => (
                                        <tr
                                          className="odd:bg-white even:bg-gray-100"
                                          key={jobIndex}
                                        >
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 max-w-[160px] text-pretty">
                                            {isJobObject(job) ? job.title : job}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {isJobObject(job)
                                              ? job.company
                                              : ""}
                                          </td>
                                          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 w-[100px]">
                        {job.description}
                      </td> */}
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {isJobObject(job)
                                              ? job.location
                                              : ""}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {
                                              isJobObject(job) ? job?.['date posted'] : ""}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                            <a
                                              href={
                                                isJobObject(job) ? job.url : ""
                                              }
                                              className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                                            >
                                              visit link
                                            </a>
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  {/* Fix for the jobs rendering - handle both string and object types */}
                </p>
              </div>
            </div>
          ))}
          <div className="w-full space-y-8 h-[100px] bg-transparent"></div>
        </div>
      </main>

      {/* Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-sm">
        {chatbotIsLoading && (
          <div className="flex justify-center w-full">
            <Loading />
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <div className={`max-w-[1000px] mx-auto flex gap-2 ${language === "arabic" ? "flex-row-reverse" : ""}`}>
                    <div
                      className="flex-1 flex items-center gap-2 bg-white border rounded-lg px-3 py-2"
                      style={{
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                      }}
                    >
                      <FormControl>
                        <Input
                          className="border-0 focus-visible:ring-0 px-0"
                          placeholder="Type your message here..."
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button
                        className="w-full h-full rounded-[8px] py-4"
                        disabled={chatbotIsLoading}
                        type="submit"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </>
  );
}

export default ChatBot;
