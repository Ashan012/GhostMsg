"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-indigo-500">GhostMsg</h1>
        <div className="space-x-4 text-gray-300">
          <a href="/sign-up" className="hover:text-indigo-400">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 max-w-6xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Send Messages Anonymously
        </h2>
        <p className="text-gray-300 mb-6 max-w-xl">
          Share your thoughts, secrets, or feedback without revealing your
          identity.
        </p>

        <Button asChild>
          <a
            href="/sign-up"
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-md"
          >
            Get Started
          </a>
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
        © 2025 GhostMsg. All rights reserved.
      </footer>
    </div>
  );
}
