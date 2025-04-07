import Q1 from "@/components/q1";
import { useTranslations } from "next-intl";

export default function Q1Page() {

  return (
    <>
      <div className="relative isolate px-6 lg:px-8">
        <div className="mx-auto max-w-2xl  sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-balance text-5xl tracking-tight text-black sm:text-6xl uppercase font-bold">
              Verify that you are currently enrolled as a student
            </h1>
            <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
              Verify your current enrollment status as a student by providing your valid student ID.
            </p>
            <Q1 />
          </div>
        </div>
      </div>
    </>
  );
}
