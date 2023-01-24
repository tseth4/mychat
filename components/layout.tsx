import Head from "next/head";
import React, { ReactNode } from "react";
// import { useTheme } from "next-themes";
// import Header from "./header";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <title>My Chat</title>
        <meta name="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen items-center justify-center border-blackGradient bg-paleBlue dark:border-pureWhite dark:bg-darkBlue">
        {children}
      </main>
    </>
  );
};

export default Layout;
