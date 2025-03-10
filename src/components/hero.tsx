import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Check, X } from "lucide-react";
import HeroButtons from "./containers/hero-buttons";

function HeroSection() {
  const t = useTranslations("Question1");

  return (
    <div className="relative isolate px-6 lg:px-8">
      <div className="mx-auto max-w-2xl  sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-balance text-5xl tracking-tight text-black sm:text-7xl uppercase font-bold">
            {t("question")}
          </h1>
          <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            {t("des")}
          </p>
          <HeroButtons /> 
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
