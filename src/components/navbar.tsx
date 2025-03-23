"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
function Navbar({ locale }: { locale: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex justify-between my-8 z-10 items-center navbar">
      <Link href="/">
        <Image
          src={
            "https://www.squ.edu.om/Portals/0/EnglishSQUlogo-100.png?ver=s1WB6WH6ixA8eme40pJSxw%3d%3d"
          }
          alt="SQU"
          width={200}
          height={100}
        />
      </Link>
      <div className="relative inline-block text-left">
        {locale === "ar" ? (
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
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default Navbar;
