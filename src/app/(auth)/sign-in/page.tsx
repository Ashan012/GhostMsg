"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import { signInSchema } from "@/Schema/signInSchema";
import { signIn } from "next-auth/react";

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (data) {
      try {
        setIsSubmitting(true);
        const response = await signIn("credentials", {
          redirect: false,
          identifier: data.identifier,
          password: data.password,
        });

        if (response?.url) {
          toast.success("Login Successfully");
          router.replace(`/dashboard`);
        }
      } catch (error) {
        let axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message);
        console.log(axiosError);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow">
            Login Your Account
          </h1>
          <p className="text-gray-300 mt-2">
            Join True Feedback & begin your anonymous journey
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* USERNAME */}

            {/* EMAIL */}
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">
                    Email/username
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <Input
                        required
                        className="pl-10 bg-white/20 text-white border-white/30 placeholder-gray-300"
                        placeholder="Enter email or username"
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
                "Login"
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
