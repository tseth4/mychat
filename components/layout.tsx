// import { type NextPage } from "next";
// import Link from "next/link";
import Head from "next/head";
import React, { ReactNode } from "react";
// import Header from "./login";
import { useTheme } from "next-themes";
// import { ThemeProvider } from "next-themes";

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const handleSetTheme = () => {
    if (theme === 'light'){
      setTheme('dark');
    } else {
      setTheme('light')
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
      <a onClick={() => handleSetTheme()} className="border-2">
        light/dark
      </a>
      <main className="border-2 border-pureWhite dark:border-blackGradient">
        {children}
      </main>
    </>
  );
}
