"use client";
import React from "react";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import {
  usePermistionCheckMutation,
} from "@/redux/features/chatbot-api";
import Loading from "../loading/loader";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";


function PermisionButton() {
  const { language } = useLanguage();
  const [checkPermision, { data, isLoading, isSuccess }] =
    usePermistionCheckMutation();

  const { studentid } = useParams();
  const { push } = useRouter();
  const buttonHandler = async (value1: string) => {
    const value = { 
      access_choice: value1,
      student_id: studentid,
      status: parseInt(localStorage.getItem("status") || "0"),
    };
    await checkPermision(value);
  };
  if (isSuccess) {
    if (data?.student_id == null) {
      localStorage.setItem("status", data?.status);
      localStorage.setItem("student_id", data?.student_id);
      push(`/service/guest`);
    } else {
      localStorage.setItem("status", data?.status);
      localStorage.setItem("student_id", data?.student_id);
      localStorage.setItem("permission", data?.permission_granted);
      push(`/service/${data.student_id || 'guest'}`);
    }
  }
  return (
    <div>
      <div className={`mt-10 flex items-center justify-center ${language === 'arabic' && "flex-row-reverse"} gap-x-6`}>
        <Button size={"lg"} onClick={() => buttonHandler("yes")}>
          <Check color="green" />
          Yes
        </Button>{" "}
        <Button size={"lg"} onClick={() => buttonHandler("no")}>
          <X color="red" />
          No
        </Button>
      </div>
      {isLoading && <Loading />}
    </div>
  );
}
export default PermisionButton;