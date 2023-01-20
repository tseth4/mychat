import Head from "next/head";
// import Link from "next/link";
import React, { FunctionComponent, ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <div className="text-white">Signed in as </div>
        <div className="text-white">
          {session.user ? session.user.email : ""} <br />
        </div>
        <button className="text-white" onClick={() => signOut()}>
          Sign out
        </button>
      </>
    );
  }
  return (
    <>
      <div className="text-white">Not signed in</div> <br />
      <button className="text-white" onClick={() => signIn()}>
        Sign in
      </button>
    </>
  );
}
