"use client";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { verifySchema } from "@/Schema/verifyScehama";

type VerifyFormData = z.infer<typeof verifySchema>;

function VerifyAccount() {
  const router = useRouter();
  const { username } = useParams();
  const [loading, setLoading] = useState(false);

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: VerifyFormData) => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        ...data,
        username,
      });
      if (response) {
        toast.success("Account verified successfully!");
        router.replace("/sign-in");
      }
    } catch (error: any) {
      toast.warning(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Verify Account
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Enter the 6-digit verification code sent to your email/phone.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="verifyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="bg-gray-100 text-gray-800 border border-gray-300 focus:border-indigo-500"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Please enter the 6-digit code we sent.
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount;
