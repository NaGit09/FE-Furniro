"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import {
  RegisterFormData,
  registerSchema,
} from "@/schema/request/register.req";
import { register } from "@/services/api/Auth/auth.service";
import { register as registerAction } from "@/stores/slices/auth.store";
import PhoneInput from "./PhoneInput";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function RegisterForm() {
  const dispatch = useDispatch();

  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      numberPhone: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Check passsword match
      if (data.password !== data.confirmPassword) {
        form.setError("root", {
          message: "Password do not match",
        });
        return;
      }
      const res = await register(data);

      if (res?.code === 200) {
        dispatch(registerAction(res.data));
        router.push("/user/login");
      } else {
        form.setError("root", {
          message: res?.message || "Login failed",
        });
      }
    } catch (err) {
      form.setError("root", {
        message: "Something went wrong",
      });
    }
  };

  const navitegateToLogin = () => {
    router.push("/user/login");
  };

  return (
    <div className="w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register new account</CardTitle>
          <CardDescription>
            Enter your information below to register to your account
          </CardDescription>
          <CardAction>
            <Button
              className="text-blue-600"
              onClick={navitegateToLogin}
              variant="link"
            >
              Login
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          {/* Register form */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* First name */}
              <div className="grid gap-2">
                <Label htmlFor="firstName">FirstName</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  required
                  {...form.register("firstName")}
                />
              </div>
              {/* Last name */}
              <div className="grid gap-2">
                <Label htmlFor="lastName">LastName</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  required
                  {...form.register("lastName")}
                />
              </div>
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...form.register("email")}
                />
              </div>
              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-600"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  {...form.register("password")}
                />
              </div>
              {/* Confirm Password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Enter your confirm password"
                  required
                  {...form.register("confirmPassword")}
                />
              </div>
              {/* Number Phone */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="numberPhone">Number Phone</Label>
                </div>
                <Controller
                  control={form.control}
                  name="numberPhone"
                  render={({ field }) => (
                    <PhoneInput value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <Button
                type="submit"
                className="w-full bg-yellow-700 text-white font-bold"
              >
                Register
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
