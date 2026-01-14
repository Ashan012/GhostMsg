"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signInSchema } from "@/Schema/signInSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { AxiosError } from "axios";

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
import { Loader2, Mail, Lock } from "lucide-react";

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
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Something went wrong");
      console.log(axiosError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-8 rounded-2xl shadow-lg bg-white border border-gray-200">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
            Login Your Account
          </h1>
          <p className="text-gray-600 mt-2">
            Join True Feedback & begin your anonymous journey
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* EMAIL/USERNAME */}
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Email / Username
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <Input
                        required
                        placeholder="Enter email or username"
                        className="pl-10 bg-gray-100 text-gray-800 border border-gray-300 placeholder-gray-400"
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
                        placeholder="Enter password"
                        className="pl-10 bg-gray-100 text-gray-800 border border-gray-300 placeholder-gray-400"
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

        <p className="text-center text-gray-600">
          Create your account?{" "}
          <Link className="text-indigo-600 hover:underline" href="/sign-up">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
