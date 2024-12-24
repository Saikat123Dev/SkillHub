
'use client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CardWrapper from "./card-wrapper";

const RegisterForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      birthday: "",
    },
  });

  const onSubmit = async (values:any) => {
    setError("");
    setSuccess("");

    if (!values.birthday) {
      setError("Birthday is required");
      return;
    }

    startTransition(() => {
      // Your registration logic here
      setSuccess("Account created successfully!");
      router.push("/settings");
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <CardWrapper
      headerLabel="Create Account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}

                    placeholder="John Doe"
                  />
                </FormControl>
                <FormMessage className="text-xs lg:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium text-sm">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    disabled={isPending}

                    placeholder="john@example.com"
                  />
                </FormControl>
                <FormMessage className="text-xs lg:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium text-sm">
                  Date of Birth
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    disabled={isPending}

                  />
                </FormControl>
                <FormMessage className="text-xs lg:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium text-sm">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      disabled={isPending}

                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 lg:h-5 lg:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 lg:h-5 lg:w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs lg:text-sm" />
              </FormItem>
            )}
          />
          </div>

          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}

          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 mt-6 text-sm lg:text-base"
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 lg:w-5 lg:h-5 border-t-2 border-white rounded-full animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
