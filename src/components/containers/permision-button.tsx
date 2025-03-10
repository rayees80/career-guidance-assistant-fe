"use client";
import React from "react";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import {
  useCheckStudentMutation,
  usePermistionCheckMutation,
} from "@/redux/features/chatbot-api";
import Loading from "../loading/loader";
import { useParams, useRouter } from "next/navigation";

function PermisionButton() {
  const [checkPermision, { data, isLoading, isSuccess }] =
    usePermistionCheckMutation();
  // const {data:blogposts, isLoading:isBlogpostLoading, error} = useGetBlogPostsQuery();
  const { locale, studentid } = useParams();
  const { push } = useRouter();
  const buttonHandler = async (value1: string) => {
    const value = { access_choice: value1 };
    await checkPermision(value);
    // console.log(data);
  };

  if (isSuccess) {
    if (data && data?.redirect === "/career_assistant/verify_id/") {
      console.log("redirecting to qsd");
      push(`/${locale}/service/${studentid}`);
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

export default PermisionButton;
