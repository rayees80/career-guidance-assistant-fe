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
import { useChatbotPromptMutation, useSendPromptMutation } from "@/redux/features/chatbot-api";
import { useParams } from "next/navigation";

const options = [
  {
    heading: "Assist me in creating my CV",
    description:
      "Get assistance in building a professional CV that effectively highlights your skills and experience.",
  },
  {
    heading: "Assist me in optimizing my Linkedin profile",
    description:
      "Optimize your LinkedIn profile to showcase your expertise and attract potential employers or connections.",
  },
  {
    heading: "Recommend me a job",
    description:
      "Receive personalized job recommendations based on your skills, experience, and interests.",
  },
  {
    heading: "Help me prepare for interviews",
    description:
      "Practice common interview questions and get tips on presenting yourself confidently.",
  },
  {
    heading: "Confused about my career",
    description:
      "Get career guidance and explore different paths that align with your skills and interests.",
  },
];

const FormSchema = z.object({
  prompt: z.string().min(1, {
    message: "prompt is required",
  }),
});

function ChatBot() {
  const [chatHistory, setChatHistory] = useState<
    { message: string; type: string }[]
  >([]);
  const [
    sendPromptCall,
    { data, isSuccess: isServiceSuccess, error, isLoading },
  ] = useSendPromptMutation();
  const [ chatbotPrompt, { data:chatbhotprompt, error:chatbotError, isLoading:chatbotIsLoading }] = useChatbotPromptMutation();
  const { locale, slug } = useParams();

  console.log(data);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const handlePrompt = (prompt: string) => {
    form.setValue("prompt", prompt);
    setChatHistory([...chatHistory, { message: prompt, type: "bot" }]);

    const obj = { service: prompt };
    sendPromptCall(obj);
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

  console.log("isServiceSuccess", isServiceSuccess);
  return (
    <>
      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8  overflow-hidden mb-[125px]">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="w-16 h-14 bg-gray-800 rounded-2xl mx-auto flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
          {/* <h2 className="text-gray-600 text-xl">Hi, Asal Design</h2> */}
          <h1 className="text-3xl font-semibold">
            Can I help you with anything?
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Ready to assist you with anything you need, from answering questions
            to providing recommendations. Let's get started!
          </p>
        </div>

        {/* Cards Grid */}
        <div className="overflow-auto pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options &&
              options.map((option, index) => {
                return (
                  <Card
                    className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    key={index}
                    onClick={() => handlePrompt(option.heading)}
                  >
                    <h3 className="font-medium mb-1">{option.heading}</h3>
                    <p className="text-sm text-gray-500">
                      {option.description}
                    </p>
                  </Card>
                );
              })}
          </div>
         
        </div>
      </main>

      {/* Chat Input */}
      
    </>
  );
}

export default ChatBot;
