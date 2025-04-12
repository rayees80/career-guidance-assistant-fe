"use client";
import { useEffect } from "react";
import React from "react";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { useCheckStudentMutation } from "@/redux/features/chatbot-api";
import Loading from "../loading/loader";
import { useParams, useRouter } from "next/navigation";

function HeroButtons() {
  const [checkStudent, { data, isLoading, isSuccess }] =
    useCheckStudentMutation();
  const [langua, setLangua] = React.useState<string | null>(null);

  const { push } = useRouter();
  const buttonHandler = async (value1: string) => {
    const value = { user_response: value1 };
    await checkStudent(value);
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    console.log("🚀 ~ useEffect ~ storedLanguage:", storedLanguage)
    const listenStorageChange = () => {
      if (storedLanguage === null) {
        setLangua("english");
      } else {
        setLangua(JSON.parse(storedLanguage));
      }
    };
    window.addEventListener("storage", listenStorageChange);
    return () => window.removeEventListener("storage", listenStorageChange);
  }, []);

  

  if (isSuccess) {
    if (data && data?.redirect === "/career_assistant/verify_id/") {
      push(`/q1`);
    } else {
      push(`/service/guest`);
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
