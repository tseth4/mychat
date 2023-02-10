import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";

interface HeaderProps {
  pusher: any;
}
export default function Header({ pusher }: HeaderProps) {
  const { data: session } = useSession();
  // console.log("ession: ", session);
  const [error, setError] = useState(null);
  const { theme, setTheme } = useTheme();
  const [profileImage, setProfileImage] = useState<string | null | undefined>(
    ""
  );
  const handleSetTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const handleAuth = (ty: string) => {
    if (ty === "signin") {
      signIn()
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
          setError(e);
        });
    } else {
      signOut()
        .then((res) => {
          console.log(res);
          pusher.current.unsubscribe("presence-channel");
        })
        .catch((e) => {
          console.log(e);
          setError(e);
        });
    }
  };
  useEffect(() => {
    if (session && session.user) {
      setProfileImage(session.user.image);
    }
  }, [session]);

  return (
    <>
      <div>{error ? error : ""}</div>

      <div className="mb-4 flex flex-row justify-between">
        {!session && (
          <>
            <div className="text-white">
              <a
                href={`/api/auth/signin`}
                className="dark:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  handleAuth("signin");
                }}
              >
                Sign in
              </a>
            </div>
          </>
        )}
        {session?.user && (
          <>
            <div className="text-sm font-medium text-darkBlueGreen dark:text-white">
              <div className="flex flex-row">
                Welcome{" "}
                <div className="ml-2 mr-2 w-4">
                  {profileImage ? <img src={profileImage} /> : ""}
                </div>
                {session.user ? session.user.name : ""} <br />
              </div>
              <a
                href={`/api/auth/signout`}
                className="dark:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  handleAuth("signout");
                }}
              >
                Sign out
              </a>
            </div>
          </>
        )}
        <a
          className="text-yellow cursor-pointer text-sm"
          onClick={() => handleSetTheme()}
        >
          {theme === "light" ? (
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19.513 11.397a.701.701 0 00-.588.128 7.496 7.496 0 01-2.276 1.336 7.101 7.101 0 01-2.583.462 7.505 7.505 0 01-5.32-2.209 7.568 7.568 0 01-2.199-5.342c0-.873.154-1.72.41-2.49a6.904 6.904 0 011.227-2.21.657.657 0 00-.102-.924.701.701 0 00-.589-.128C5.32.61 3.427 1.92 2.072 3.666A10.158 10.158 0 000 9.83c0 2.8 1.125 5.342 2.967 7.19a10.025 10.025 0 007.16 2.98c2.353 0 4.527-.822 6.266-2.183a10.13 10.13 0 003.58-5.624.623.623 0 00-.46-.796z"
                fill="#697C9A"
                fillRule="nonzero"
                className="fill-pureWhite"
              />
            </svg>
          ) : (
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g className="fill-darkBlue" fill="#FFF" fillRule="nonzero">
                <path d="M13.545 6.455c-.9-.9-2.17-1.481-3.545-1.481a4.934 4.934 0 00-3.545 1.481c-.9.9-1.481 2.17-1.481 3.545 0 1.376.582 2.646 1.481 3.545.9.9 2.17 1.481 3.545 1.481a4.934 4.934 0 003.545-1.481c.9-.9 1.481-2.17 1.481-3.545a4.934 4.934 0 00-1.481-3.545zM10 3.413a.7.7 0 00.688-.688V.688A.7.7 0 0010 0a.7.7 0 00-.688.688v2.037a.7.7 0 00.688.688zM15.635 5.344l1.455-1.455a.67.67 0 000-.952.67.67 0 00-.952 0l-1.455 1.455a.67.67 0 000 .952c.238.264.66.264.952 0zM19.312 9.312h-2.037a.7.7 0 00-.688.688.7.7 0 00.688.688h2.037A.7.7 0 0020 10a.7.7 0 00-.688-.688zM15.608 14.656a.67.67 0 00-.952 0 .67.67 0 000 .952l1.455 1.455a.67.67 0 00.952 0 .67.67 0 000-.952l-1.455-1.455zM10 16.587a.7.7 0 00-.688.688v2.037A.7.7 0 0010 20a.7.7 0 00.688-.688v-2.037a.7.7 0 00-.688-.688zM4.365 14.656L2.91 16.111a.67.67 0 000 .952.67.67 0 00.952 0l1.455-1.455a.67.67 0 000-.952c-.238-.264-.66-.264-.952 0zM3.413 10a.7.7 0 00-.688-.688H.688A.7.7 0 000 10a.7.7 0 00.688.688h2.037A.7.7 0 003.413 10zM4.365 5.344a.67.67 0 00.952 0 .67.67 0 000-.952L3.862 2.937a.67.67 0 00-.952 0 .67.67 0 000 .952l1.455 1.455z" />
              </g>
            </svg>
          )}
        </a>
      </div>
    </>
  );
}
