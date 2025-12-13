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
        <h1>loading....</h1>
      )}
    </div>
  );
}
