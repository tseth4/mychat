import Head from "next/head";
import React, { ReactNode } from "react";
import { useTheme } from "next-themes";
import Header from "./header";

const Layout = ({ children }: { children: ReactNode }) => {
  const { theme, setTheme } = useTheme();
  const handleSetTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <>
      <Head>
        <title>My Chat</title>
        <meta name="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Header /> */}
      <Header />
      <a onClick={() => handleSetTheme()} className="border-2">
        light/dark
      </a>
      <main className="flex min-h-screen items-center justify-center border-blackGradient dark:border-pureWhite">
        {children}
      </main>
    </>
  );
}

export default Layout;