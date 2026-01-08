"use client";
import DashboardContentPgae from "@/components/DashboardContent";
import NavBar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { User } from "next-auth";
import DisplayMessage from "@/components/DisplayMessage";

export default function Page() {
  const [authenticated, setAuthenticated]: any = useState(false);
  const [username, setUsername]: any = useState("");
  const [isAcceptingMessage, setIsAcceptingMessage]: any = useState();
  const { data: session, status } = useSession();
  const user: User = session?.user as User;

  useEffect(() => {
    if (status === "authenticated") {
      setAuthenticated(true);
      setUsername(user?.username);
      setIsAcceptingMessage(user?.isAcceptingMessage);
    }
  }, [status]);

  return (
    <div>
      {authenticated ? (
        <div className="min-h-screen bg-gray-50">
          <NavBar username={username} authenticated={authenticated} />

          <DashboardContentPgae
            username={username}
            isAcceptingMessage={isAcceptingMessage}
          />
          <DisplayMessage authenticated={authenticated} />
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-full max-w-md space-y-4 animate-pulse">
            <div className="h-10 bg-gray-300 rounded-md" />
            <div className="h-24 bg-gray-300 rounded-md" />
            <div className="h-24 bg-gray-300 rounded-md" />
            <div className="h-10 bg-gray-300 rounded-md w-1/2 mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
