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
    const value = { 
      access_choice: value1,
      student_id: studentid,
      status: parseInt(localStorage.getItem("svids") || "0"),
    };
    await checkPermision(value);
    // console.log(data);
  };
  if (isSuccess) {

    console.log(data.student_id)

    if (data?.student_id == null) {
      console.log("redirecting to services");
      localStorage.setItem("status", data?.status);
      localStorage.setItem("student_id", data?.student_id);
      push(`/${locale}/service/guest`);
    } else {
      console.log("redirecting to services");
      localStorage.setItem("status", data?.status);
      localStorage.setItem("student_id", data?.student_id);
      push(`/${locale}/service/${data.student_id || 'guest'}`);
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