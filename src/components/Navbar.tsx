"use client";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { useEffect, useState } from "react";

export default function NavBarContent({ username, authenticated }: any) {
  return (
    <nav className="w-full bg-white shadow-md py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <h1 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Random Message
        </h1>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {authenticated && (
            <span className="text-gray-700">
              Welcome, <b>{username}</b>
            </span>
          )}

          {authenticated ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-black rounded-xl hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          ) : (
            <button className="px-4 py-2 bg-blue-600 text-black rounded-xl hover:bg-blue-700 transition">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
