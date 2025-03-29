"use client";
// import { useTranslations } from "next-intl";
import { Button } from "./ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import Loading from "./loading/loader";
import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import PermisionButton from "./containers/permision-button";

function Q2() {
  // const t = useTranslations("Question2");
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative isolate px-6 lg:px-8">
      <div className="mx-auto max-w-2xl  sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-balance text-5xl tracking-tight text-black uppercase font-bold">
            Permision to access academic records
          </h1>
            <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            To provide personalized career guidance based on your academic
            background, may we have your permission to access your academic
            records? <br /> Your information will only be used for this purpose.
            </p>
          <PermisionButton />
        </div>
      </div>
    </div>
  );
}

export default Q2;
