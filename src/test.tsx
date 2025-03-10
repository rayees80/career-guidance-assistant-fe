"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./components/ui/button";

function Test() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="relative inline-block text-left">
      <Button
        onClick={() => {
          startTransition(() => {
            router.replace(`/en`);
          });
        }}
        className=" mx-3 px-3 py-2"
      >
        English
      </Button>
      <Button
        onClick={() => {
          startTransition(() => {
            router.replace(`/ar`);
          });
        }}
        className=" mx-3 px-3 py-2"
      >
        Arabic
      </Button>
    </div>
  );
}

export default Test;
