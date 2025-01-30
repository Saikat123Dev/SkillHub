'use client';

import CardWrapper from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export const SignupForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/settings";
  const router = useRouter();

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleOAuthSignUp = async (provider: "google" | "github") => {
    setError("");
    startTransition(async () => {
      try {
        const result = await signIn(provider, { redirect: false, callbackUrl });
        if (result?.error) {
          setError("Authentication failed. Please try again.");
        } else {
          router.push(callbackUrl);
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again later.");
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm font-medium text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4 mt-6">
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => handleOAuthSignUp("google")}
          className="flex items-center gap-2 w-full h-12 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 shadow-md rounded-lg transition-all duration-200"
        >
          <FaGoogle className="h-5 w-5" />
          <span className="text-base font-semibold">Sign up with Google</span>
        </Button>
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => handleOAuthSignUp("github")}
          className="flex items-center gap-2 w-full h-12 bg-gray-900 hover:bg-gray-800 text-white shadow-md rounded-lg transition-all duration-200"
        >
          <FaGithub className="h-5 w-5" />
          <span className="text-base font-semibold">Sign up with GitHub</span>
        </Button>
      </div>
    </CardWrapper>
  );
};

export default SignupForm;
