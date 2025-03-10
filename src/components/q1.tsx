"use client";
// import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loading from "./loading/loader";
import { useState } from "react";
// import Q2 from "./q2";
import {
  // useCheckStudentMutation,
  useVerifyStudentMutation,
} from "@/redux/features/chatbot-api";

const formSchema = z.object({
  studentId: z.string().min(1, {
    message: "Student ID is required",
  }),
});

function Q1() {
  const { push } = useRouter();
  const { locale } = useParams();
  const [attempts, setAttempts] = useState<number | undefined>(0);

  const [
    verifyStudentid,
    {
      data: verificationData,
      isSuccess,
      isLoading,
      isError: ValidateVerifyStudent,
      error,
    },
  ] = useVerifyStudentMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
      let obj;
      if (attempts !== 0) {
        obj = { student_id: values.studentId, attempts: (attempts || 0) + 1 };
      } else {
        obj = { student_id: values.studentId };
      }
      try {
        await verifyStudentid(obj);
        // push(`${locale}/q2`);
      } catch (error) {
        console.error("Error", error);
      }
     
  }

  if (isSuccess) {
    const student_id = verificationData?.student_id;
    push(`/${locale}/q2/${student_id}`);
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center content-center"
        >
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter Student Id"
                    className="w-full lg:w-[500px] border-2 border-black rounded-md "
                    type="number"
                    {...field}
                  />
                </FormControl>

                <div className="relative">
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </div>
                <FormMessage />
                    {isLoading && <Loading />}
                <h1 className="text-red-500">
                  {" "}
                  {ValidateVerifyStudent && error?.data?.message}
                </h1>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

export default Q1;
