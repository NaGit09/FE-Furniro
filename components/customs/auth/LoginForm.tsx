"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { LoginFormData, loginSchema } from "@/schema/request/login.req";
import { login } from "@/services/api/Auth/auth.service";
import { login as loginAction } from "@/stores/slices/auth.store";

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

export default function LoginForm() {
  const dispatch = useDispatch();

  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await login(data);

      if (res?.code === 200) {
        dispatch(loginAction(res.data));
        router.push("/");
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

  const navitegateToRegister = () => {
    router.push("/user/register");
  };

  return (
    <div className="w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button
              className="text-blue-600"
              variant="link"
              onClick={navitegateToRegister}
            >
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...form.register("password")}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-3">
              <Button
                className="w-full bg-yellow-700 text-white font-bold"
                onClick={() => onSubmit(form.getValues())}
              >
                Login
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
