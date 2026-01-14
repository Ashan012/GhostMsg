"use client";
import { signOut } from "next-auth/react";

export default function NavBarContent({ username, authenticated }: any) {
  return (
    <nav className="w-full bg-white shadow-md py-4 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <h1 className="sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Anonymous Feedback
        </h1>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Show username only on sm+ screens */}
          {authenticated && (
            <span className="hidden sm:inline text-gray-700 text-base">
              Welcome, <b>{username}</b>
            </span>
          )}

          {authenticated ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition text-sm sm:text-base"
            >
              Sign Out
            </button>
          ) : (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm sm:text-base">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
