"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // optional, agar Sonner use kar rahe ho

export default function DashboardContent({
  username,
  isAcceptingMessage,
}: any) {
  const [acceptMessage, setAcceptMessage] = useState(isAcceptingMessage);
  const url = `https://ghostmysg.vercel.app/u/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied!"); // agar Sonner use ho
    } catch (err) {
      toast.error("Failed to copy!");
    }
  };

  useEffect(() => {
    const checkMessageAcceptanceStatus = async () => {
      try {
        const response = await axios.get("/api/accept-message");
        if (response) {
          setAcceptMessage(response.data.isAcceptingMessage);
          console.log(response.data.isAcceptingMessage);
        }
      } catch (error) {
        console.error(error);
        const errorMessage = error as AxiosError<ApiResponse>;
        console.log(errorMessage.response?.data.message);
      }
    };
    checkMessageAcceptanceStatus();
  }, []);

  const messageAcceptance = async (status: any) => {
    try {
      const response = await axios.post("/api/accept-message", {
        acceptMessage: status,
      });

      if (response) {
        setAcceptMessage(!acceptMessage);
        console.log("update successfully");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error as AxiosError<ApiResponse>;
      console.log(errorMessage.response?.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600">Copy your link:</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          readOnly
          onFocus={(e) => e.target.select()}
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleCopy}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Copy
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={acceptMessage}
          id="accept-message"
          onClick={() => messageAcceptance(!acceptMessage)}
        />
        <Label htmlFor="accept-message">
          accept message {acceptMessage ? "On" : "Off"}
        </Label>
      </div>
    </div>
  );
}
