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

const FormSchema = z.object({
  prompt: z.string().min(1, {
    message: "prompt is required",
  }),
});

function ChatBot() {
  const [chatHistory, setChatHistory] = useState<
    { message: string; type: string }[]
  >([]);
  const [isClient, setIsClient] = useState(false);
  const [service, setService] = useState<string | null>(null);
  const [firstResponse, setFirstResponse] = useState<string | null>(null);
  const [isStudent, setIsStudent] = useState<string | null>(null);

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
    setIsStudent(localStorage.getItem("student_id"));
  }, []);

  // Add this useEffect to handle successful responses
  useEffect(() => {
    if (isChatbotResponseSuccess && chatbotResponse) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { message: chatbotResponse, type: "bot" },
      ]);
      
      // Use safer scrolling mechanism
      if (typeof window !== "undefined") {
        window.requestAnimationFrame(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
          });
        });
      }
    }
  }, [isChatbotResponseSuccess, chatbotResponse]);

  const formatText = (text: string | null) => {
    // Remove outer quotes if present
    let processedText =
      text && text.startsWith('"') && text.endsWith('"')
        ? text.substring(1, text.length - 1)
        : text || "";

    // Replace literal "\n\n" with actual line breaks for rendering
    processedText = processedText.replace(/\\n\\n/g, "\n\n");
    processedText = processedText.replace(/\\n/g, "\n");

    // Split text into paragraphs
    const paragraphs = processedText.split("\n\n");

    return (
      <div className="text-center max-w-lg mx-auto">
        {paragraphs.map((paragraph, index) => {
          // Process markdown-style bold text (**text**)
          const parts = [];
          let lastIndex = 0;
          const boldRegex = /\*\*(.*?)\*\*/g;
          let boldMatch;

          // Create an array of text parts with bold elements
          while ((boldMatch = boldRegex.exec(paragraph)) !== null) {
            // Add text before the bold part
            if (boldMatch.index > lastIndex) {
              parts.push(paragraph.substring(lastIndex, boldMatch.index));
            }
            // Add the bold part (without the ** markers)
            parts.push(
              <strong key={`bold-${index}-${boldMatch.index}`}>
                {boldMatch[1]}
              </strong>
            );
            lastIndex = boldMatch.index + boldMatch[0].length;
          }

          // Add any remaining text after the last bold part
          if (lastIndex < paragraph.length) {
            parts.push(paragraph.substring(lastIndex));
          }

          return <p key={index}>{parts.length > 0 ? parts : paragraph}</p>;
        })}
      </div>
    );
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth"
        });
      });
    }

    setChatHistory((prevHistory) => [
      ...prevHistory,
      { message: data.prompt, type: slug === "guest" ? "Guest" : "Student" },
    ]);

    try {
      // Only access localStorage when in client environment
      if (typeof window !== "undefined") {
        const obj = {
          query: data.prompt,
          student_id: localStorage.getItem("student_id") || "",
          status: parseInt(localStorage.getItem("status") || "0"),
          permission_granted: parseInt(localStorage.getItem("permission") || "0"),
          language: localStorage.getItem("language") || "english",
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
    return <div className="min-h-screen flex items-center justify-center">
      <Loading />
    </div>;
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8 overflow-hidden mb-[125px]">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-gray-800 rounded-2xl mx-auto flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold">{service}</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            {formatText(firstResponse)}
          </p>
        </div>

        <div className="mb-10">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 my-2 ${
                chat.type === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              <div className={`flex items-center gap-2 p-2`}>
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
                  className={`p-2 ${
                    chat.type === "bot"
                      ? "bg-white text-gray-800 rounded-tr-[10px] rounded-bl-[10px]"
                      : "bg-blue-500 text-white rounded-tl-[10px] rounded-br-[10px]"
                  }`}
                >
                  {chat.type === "bot"
                    ? formatText(chat?.message?.response)
                    : formatText(chat?.message)}

                  {chat.type === "bot" &&
                    chat?.message?.["section_options"]?.map((option: string) => (
                      <Button
                        key={option}
                        className="mx-2 bg-blue-500 text-white rounded-lg px-4 py-2 mt-2 flex flex-col"
                        onClick={() => {
                          form.setValue("prompt", option);
                          form.handleSubmit(onSubmit)();
                        }}
                      >
                        {option}
                      </Button>
                    ))}

                  {chat.type === "bot" &&
                    chat?.message?.["list_options"]?.map((option: string) => (
                      <Button
                        key={option}
                        className="mx-2 bg-blue-500 text-white rounded-lg px-4 py-2 mt-2 flex flex-col"
                        onClick={() => {
                          setChatHistory((prevHistory) => [
                            ...prevHistory,
                            { message: option, type: "user" },
                          ]);
                          form.setValue("prompt", option);
                          form.handleSubmit(onSubmit)();
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  {chat.type === "bot" &&
                    chat?.message?.["jobs"]?.map((job: string) => (
                      <Card
                        key={job}
                        className="mx-2 bg-blue-500 text-white rounded-lg px-4 py-2 mt-2 flex flex-col"
                      >
                        <div className="flex items-center gap-2">
                          <Plane className="w-8 h-8" />
                          <p>{job}</p>
                        </div>
                      </Card>
                    ))}
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
                  <div className="max-w-3xl mx-auto flex gap-2">
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