import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(session)
  }, [session])

  const handleAuth = (ty: string) => {
    if (ty === "signin") {
      signIn()
        .then((res) => {
          console.log(res);
        })
        .catch((e) => console.log(e));
    } else {
      signOut()
        .then((res) => {
          console.log(res);
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <>
    <div>{error ? error : ""}</div>
      {!session && (
        <>
          <div className="text-white">Not signed in</div> <br />
          <a
            href={`/api/auth/signin`}
            className="text-white"
            onClick={(e) => {
              e.preventDefault();
              handleAuth("signin");
            }}
          >
            Sign in
          </a>
        </>
      )}
      {session?.user && (
        <>
          <div className="text-white">
            {session.user ? session.user.email : ""} <br />
          </div>
          <a
            href={`/api/auth/signout`}
            className="text-white"
            onClick={(e) => {
              e.preventDefault();
              handleAuth("signout");
            }}
          >
            Sign out
          </a>
        </>
      )}
    </>
  );

  // if (session) {
  //   return (
  //     <>
  //       <div className="text-white">
  //         {session.user ? session.user.email : ""} <br />
  //       </div>
  //       <button className="text-white" onClick={() => signOut()}>
  //         Sign out
  //       </button>
  //     </>
  //   );
  // }
  // return (
  //   <>
  //     <div className="text-white">Not signed in</div> <br />
  //     <button className="text-white" onClick={() => signIn()}>
  //       Sign in
  //     </button>
  //   </>
  // );
}
