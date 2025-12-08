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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow">
            Create Account
          </h1>
          <p className="text-gray-300 mt-2">
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
                  <FormLabel className="text-gray-200">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserPlus
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <Input
                        required
                        className="pl-10 bg-white/20 text-white border-white/30 placeholder-gray-300"
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
                      className="animate-spin text-white mt-1"
                      size={20}
                    />
                  )}

                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`mt-1 ${
                        usernameMessage === "Username is unique"
                          ? "text-green-400"
                          : "text-red-400"
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
                  <FormLabel className="text-gray-200">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <Input
                        required
                        className="pl-10 bg-white/20 text-white border-white/30 placeholder-gray-300"
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
                  <FormLabel className="text-gray-200">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <Input
                        type="password"
                        required
                        className="pl-10 bg-white/20 text-white border-white/30 placeholder-gray-300"
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

        <p className="text-center text-gray-300">
          Already have an account?{" "}
          <Link className="text-indigo-400 hover:underline" href="/sign-in">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
