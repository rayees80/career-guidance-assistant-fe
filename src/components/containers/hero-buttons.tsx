"use client";
import React from "react";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { useCheckStudentMutation } from "@/redux/features/chatbot-api";
import Loading from "../loading/loader";
import { useParams, useRouter } from "next/navigation";

function HeroButtons() {
  const [checkStudent, { data, isLoading, isSuccess }] =
    useCheckStudentMutation();
  const { locale } = useParams();
  const { push } = useRouter();
  const buttonHandler = async (value1: string) => {
    const value = { user_response: value1 };
    await checkStudent(value);
  };

  if (isSuccess) {
    if (data && data?.redirect === "/career_assistant/verify_id/") {
      push(`/${locale}/q1`);
    } else {
      push(`/${locale}/service/guest`);
    }
  }
  return (
    <div>
      <div className="mt-10 flex items-center justify-center gap-x-6">
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

export default HeroButtons;
