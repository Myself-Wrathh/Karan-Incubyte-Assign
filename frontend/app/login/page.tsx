"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI, type ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = "karan@admin.com";
  const ADMIN_PASSWORD = "password123";

  const fillAdminCredentials = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASSWORD);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      login(response.data.user, response.data.token);
      router.push("/dashboard");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-pink-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <span className="text-3xl">🍬</span>
          </div>
          <CardTitle className="text-3xl font-serif">Welcome Back</CardTitle>
          <CardDescription className="text-gray-800">
            Sign in to your Sweet Shop account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full mt-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-sm text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Register here
              </Link>
            </p>
          </CardFooter>
        </form>
        <Card className="border p-5 w-fit mx-auto">
          <CardHeader>
            <CardTitle className="text-sm -mb-5">
              Admin Test Credentials
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm">
            <p>
              <span className="font-medium">Email:</span> {ADMIN_EMAIL}
            </p>
            <p>
              <span className="font-medium">Password:</span> {ADMIN_PASSWORD}
            </p>
          </CardContent>

          <CardFooter>
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer border-black"
              onClick={fillAdminCredentials}
            >
              Click to fill Admin Credentials
            </Button>
          </CardFooter>
        </Card>
      </Card>
    </div>
  );
}
