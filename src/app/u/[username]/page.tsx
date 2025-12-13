"use client";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function PublicPage() {
  const { username } = useParams();
  const [content, setContent] = useState("");
  const [suggestMessage, setSuggestMessage] = useState([]);

  const sendMessage = async () => {
    if (!username || !content) return toast.warning("Message is required!");

    try {
      const response = await axios.post("/api/send-message", {
        username,
        content,
      });
      toast.success(response.data.message);
    } catch (error) {
      const err = error as AxiosError<ApiResponse>;
      toast.error(err.response?.data.message);
    } finally {
      setContent("");
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.post("/api/ai-suggest-message");
        const list = response.data?.message.split("||");
        setSuggestMessage(list);
      } catch (error) {
        const err = error as AxiosError<ApiResponse>;
        toast.error(err.response?.data.message);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Card className="shadow-xl border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Send Anonymous Message to
            <span className="text-blue-600"> @{username}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Textarea
            placeholder="Write your anonymous message..."
            className="h-28"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <Button
            onClick={sendMessage}
            className="w-full py-3 text-lg font-semibold"
          >
            Send Message
          </Button>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Suggested Messages</h3>

            <div className="space-y-3">
              {suggestMessage &&
                suggestMessage.map((msg, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                    onClick={() => setContent(msg)}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PublicPage;
