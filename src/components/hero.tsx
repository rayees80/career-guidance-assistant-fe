import { Button } from "./ui/button";
import { Check, X } from "lucide-react";
import HeroButtons from "./containers/hero-buttons";

function HeroSection() {
  return (
    <div className="relative isolate px-6 lg:px-8">
      <div className="mx-auto max-w-2xl  sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-balance text-5xl tracking-tight text-black sm:text-7xl uppercase font-bold">
            Are you a student of SQU?
          </h1>
          <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            This question is intended to confirm whether you are currently
            enrolled as a student at Sultan Qaboos University. Please select
            &apos;Yes&apos; if you are actively studying at SQU, and &apos;No&apos; if you are not
            affiliated with the university as a student.
          </p>
          <HeroButtons />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
