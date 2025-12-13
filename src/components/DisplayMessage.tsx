"use client";

import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react"; // cross icon

export default function DisplayMessage({ authenticated }: any) {
  const [message, setMessage] = useState([]);
  const [isCheckingMessage, setIsCheckingMessage] = useState(false);

  const [deleteId, setDeleteId] = useState(null); // for popup

  const confirmDelete = async (id: any) => {
    try {
      const response = await axios.delete(`/api/delete-message?id=${id}`);
      if (response.data) {
        console.log(response);
        setMessage((prev) => prev.filter((m: any) => m._id !== id));
      }
    } catch (err) {
      const errorMessage = err as AxiosError<ApiResponse>;
      console.error(errorMessage);
    } finally {
      setDeleteId(null);
    }
  };

  useEffect(() => {
    setMessage([]);
    if (authenticated) {
      const getMessages = async () => {
        try {
          setIsCheckingMessage(true);
          const response = await axios.get("/api/get-messages");
          if (response) {
            setMessage(response.data.message);
          }
        } catch (error) {
          let errorMessage = error as AxiosError<ApiResponse>;
          console.log(errorMessage.response?.data.message);
        } finally {
          setIsCheckingMessage(false);
        }
      };
      getMessages();
    }
  }, [authenticated]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      {isCheckingMessage ? (
        <div className="flex justify-center items-center py-10">
          <h1 className="text-lg font-semibold text-gray-600 animate-pulse">
            Loading messages...
          </h1>
        </div>
      ) : (
        <div>
          {message.length == 0 ? (
            <div className="text-center text-gray-500 py-10">
              No messages found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {message.map((content: any, index: any) => (
                <div
                  key={index}
                  className="relative bg-white rounded-xl shadow p-5 border border-gray-100 hover:shadow-lg transition"
                >
                  {/* Delete Icon */}
                  <button
                    onClick={() => setDeleteId(content._id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                  >
                    <X size={20} />
                  </button>

                  <h3 className="text-lg font-semibold text-gray-800 pr-6">
                    {content.content}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(content.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === POPUP FOR DELETE CONFIRMATION === */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete this message?
            </p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={() => confirmDelete(deleteId!)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
