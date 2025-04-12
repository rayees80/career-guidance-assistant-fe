"use client";
import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useDownloadCVQuery } from "@/redux/features/chatbot-api";

function Navbar() {
  const [, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const [sessionid, setSessionid] = useState<string | null>(null);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [language, setLanguage] = useState<string | null>(null);

  const intervalCV =
    typeof window !== "undefined" ? localStorage.getItem("invoked_tool") : null;

  const { data, isLoading } = useDownloadCVQuery(sessionid ?? "", {
    skip: !triggerDownload,
  });

  useEffect(() => {
    const updateSessionId = () => {
      const currentSessionId = Cookies.get("sessionid") || null;
      setSessionid(currentSessionId);
    };

    updateSessionId();

    const intervalId = setInterval(updateSessionId, 1000);
  }, []);

  useEffect(() => {
    const storedLanguage = JSON.parse(
      localStorage.getItem("language") || '"english"'
    );
    setLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    if (data && triggerDownload) {
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "CV.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTriggerDownload(false);
    }
  }, [data, triggerDownload]);

  const handleEndSession = () => {
    startTransition(() => {
      localStorage.clear();
      Cookies.remove("sessionid");
      setSessionid(null);
      router.replace("/");
    });
  };

  const handleDownloadCV = () => {
    setTriggerDownload(true);
  };

  const handleChangeLanguage = () => {
    setLanguage((prev) => (prev === "english" ? "arabic" : "english"));
    localStorage.setItem("language", JSON.stringify(language));
  };

  return (
    <div className={`flex justify-between my-8 z-10 items-center navbar ${language === "arabic" ? "flex-row-reverse" : ""}`}>
      <Link href="/">
        <Image
          src="https://www.squ.edu.om/Portals/0/EnglishSQUlogo-100.png?ver=s1WB6WH6ixA8eme40pJSxw%3d%3d"
          alt="SQU"
          width={200}
          height={100}
        />
      </Link>
      <div className="relative text-left flex gap-3">
        {sessionid && (
          <>
            {intervalCV === "cv_generator" && (
              <Button
                className="px-3 py-2"
                onClick={handleDownloadCV}
                disabled={isLoading}
              >
                {isLoading ? "Downloading..." : "Download CV"}
              </Button>
            )}
            

            <Button className="px-3 py-2" onClick={handleEndSession}>
              Change Session
            </Button>
          </>
        )}
      {pathname && pathname === "/" && (
        <Button className="px-3 py-2" onClick={handleChangeLanguage}>
           {language == "english" ? "Arabic" : "English"}
        </Button>
      )}

      </div>
    </div>
  );
}

export default Navbar;
