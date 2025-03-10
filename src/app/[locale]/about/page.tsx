import Test from "@/test";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Index");
  return (
    <div className=" flex gap-10">
      <h1 className="text-4xl mb-4 font-semibold">{t("title")}</h1>
      <Test />
    </div>
  );
}
