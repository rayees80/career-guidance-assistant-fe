"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChartSpline, Camera, Plane, Send, Bot, User2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChatbotPromptMutation,  } from "@/redux/features/chatbot-api";
import { useParams } from "next/navigation";



const FormSchema = z.object({
  prompt: z.string().min(1, {
    message: "prompt is required",
  }),
});

function ChatBot() {
  const [chatHistory, setChatHistory] = useState<
    { message: string; type: string }[]
  >([]);
 
  const [ chatbotPrompt, { data:chatbhotprompt, error:chatbotError, isLoading:chatbotIsLoading }] = useChatbotPromptMutation();
  const { locale, slug } = useParams();


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const service  = localStorage.getItem("service");
  const firstResponse = localStorage.getItem("response");

  
  const formatText = (text) => {
    // Remove outer quotes if present
    let processedText = text.startsWith('"') && text.endsWith('"') 
      ? text.substring(1, text.length - 1) 
      : text;
    
    // Replace literal "\n\n" with actual line breaks for rendering
    processedText = processedText.replace(/\\n\\n/g, '\n\n');
    processedText = processedText.replace(/\\n/g, '\n');
    
    // Split text into paragraphs
    const paragraphs = processedText.split('\n\n');
    
    return (
      <div className="text-center max-w-lg mx-auto">
        {paragraphs.map((paragraph, index) => {
          // Process markdown-style bold text (**text**)
          const parts = [];
          let remainingText = paragraph;
          let boldMatch;
          const boldRegex = /\*\*(.*?)\*\*/g;
          let lastIndex = 0;
          
          // Create an array of text parts with bold elements
          while ((boldMatch = boldRegex.exec(paragraph)) !== null) {
            // Add text before the bold part
            parts.push(paragraph.substring(lastIndex, boldMatch.index));
            // Add the bold part (without the ** markers)
            parts.push(<strong key={`bold-${index}-${boldMatch.index}`}>{boldMatch[1]}</strong>);
            lastIndex = boldMatch.index + boldMatch[0].length;
          }
          
          // Add any remaining text after the last bold part
          parts.push(paragraph.substring(lastIndex));
          
          return (
            <p key={index} className="text-gray-600 mb-4">
              {parts.length > 1 ? parts : paragraph}
            </p>
          );
        })}
      </div>
    );
  };


  const handlePrompt = (prompt: string) => {
    form.setValue("prompt", prompt);
    setChatHistory([...chatHistory, { message: prompt, type: "bot" }]);

 
    chatbotPrompt({ query: prompt })

    setChatHistory([
      ...chatHistory,
      { message: prompt, type: slug === "guest" ? "Guest" : "Student" },
    ]);
    window.scrollTo(0, document.body.scrollHeight);
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setChatHistory([...chatHistory, { message: data.prompt, type: "bot" }]);

    const obj = { query: data.prompt };
    chatbotPrompt(obj);

    setChatHistory([
      ...chatHistory,
      { message: data.prompt, type: slug === "guest" ? "Guest" : "Student" },
    ]);
    window.scrollTo(0, document.body.scrollHeight);
    // Reset the form
    form.reset();
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8  overflow-hidden mb-[125px]">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-gray-800 rounded-2xl mx-auto flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
          {/* <h2 className="text-gray-600 text-xl">Hi, Asal Design</h2> */}
          <h1 className="text-3xl font-semibold">
            {service}
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
          {formatText(firstResponse)}
          </p>
        </div>

        <div>
            {chatHistory.map((chat, index) => {
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 my-2 ${
                    chat.type === "bot" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className={`flex items-center gap-2 p-2 `}>
                    {chat.type === "bot" ? (
                      <Bot className="w-8 h-8" />
                    ) : (
                      <User2 className="w-8 h-8" />
                    )}
                    {chat.type === "bot"
                      ? "BOT"
                      : slug === "guest"
                      ? "Guest"
                      : "Student"}
                    <p
                      className={` p-2 ${
                        chat.type === "bot"
                          ? "bg-white text-gray-800 rounded-tr-[10px] rounded-bl-[10px] "
                          : " bg-blue-500 text-white rounded-tl-[10px] rounded-br-[10px]"
                      }`}
                    >
                      {chat.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
    
      </main>

      {/* Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-sm">
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
                          // disabled={isServiceSuccess ? false : true}
                        />
                      </FormControl>
                    </div>
                    <div className="flex items-center  justify-center  ">
                      <Button
                        className="w-full h-full rounded-[8px] py-4"
                        // disabled={isServiceSuccess ? false : true}
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
