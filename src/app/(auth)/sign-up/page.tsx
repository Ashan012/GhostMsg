"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SignupSchema } from "@/Schema/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, Mail, Lock } from "lucide-react";

export default function Page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setIsUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounce = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setIsUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setIsUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setIsUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`/api/sign-up`, data);

      if (response) {
        toast.success(response.data.message);
        router.replace(`/verify/${data.username}`);
      }
    } catch (error) {
      let axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-8 rounded-2xl shadow-lg bg-white border border-gray-200">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
            Create Account
          </h1>
          <p className="text-gray-600 mt-2">
            Join True Feedback & begin your anonymous journey
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* USERNAME */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserPlus
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <Input
                        required
                        className="pl-10 bg-gray-100 text-gray-800 border border-gray-300 placeholder-gray-400"
                        placeholder="Enter username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounce(e.target.value);
                        }}
                      />
                    </div>
                  </FormControl>

                  {isCheckingUsername && (
                    <Loader2
                      className="animate-spin text-gray-500 mt-1"
                      size={20}
                    />
                  )}

                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`mt-1 ${
                        usernameMessage === "Username is unique"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <Input
                        required
                        className="pl-10 bg-gray-100 text-gray-800 border border-gray-300 placeholder-gray-400"
                        placeholder="Enter email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <Input
                        type="password"
                        required
                        className="pl-10 bg-gray-100 text-gray-800 border border-gray-300 placeholder-gray-400"
                        placeholder="Enter password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-lg bg-indigo-600 hover:bg-indigo-700 transition-all rounded-xl"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link className="text-indigo-600 hover:underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
