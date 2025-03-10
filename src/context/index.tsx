"use client";
import { createContext, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useContext, useState } from "react";
// import { useState } from "react";

// type langType = "en" | "ar";
// type AppContextType = {
//   lang: langType;
//   setLang: Function;
// };

// const DEFAULT_VALUE: AppContextType = {
//   lang: "en",
//   setLang: () => {},
// };

// export const AppContext = createContext<AppContextType>(DEFAULT_VALUE);

// export default function AppWrapper({ children }: { children: React.ReactNode }) {
//   const [lang, setLang] = useState<langType>(DEFAULT_VALUE.lang);
//   return (
//     <AppContext.Provider value={{ lang, setLang }}>
//       {children}
//     </AppContext.Provider>
//   );
// }

// export const useAppContext = () => useContext(AppContext);

import { useRouter } from "next/router";
export const UserContext = createContext<{ locale: any; setLocale: React.Dispatch<React.SetStateAction<any>> }>({ locale: {}, setLocale: () => {} });
const LocaleProvider = (props: { children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) => {
  const [locale, setLocale] = useState({});
  const storeUser = (locale: { locale: any }) => {
    setLocale({
      locale: locale.locale,
    });
  };

  return (
    <UserContext.Provider value={{ locale, setLocale }}>
      {props.children}
    </UserContext.Provider>
  );
};
export default LocaleProvider;
