"use client";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { verifySchema } from "@/Schema/verifyScehama";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

function VerifyAccount() {
  const router = useRouter();
  const { username } = useParams();

  const form = useForm({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: any) => {
    data.username = username;

    try {
      const response = await axios.post(`/api/verify-code`, data);
      if (response) {
        router.replace("/sign-in");
      }
    } catch (error) {
      const errorMessage = error as AxiosError<ApiResponse>;
      toast.warning(errorMessage.response?.data.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-center mb-2">
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
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-xs">
                    Please enter the 6-digit code we sent.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount;
