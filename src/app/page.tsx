"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginUser } from "@/types/User";
import { loginUser } from "@/functions/User";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function StudentRegistration() {
  const router = useRouter();
  const [user, setUser] = useState<LoginUser>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await loginUser(user).then((_) => router.push("/me"));
      setUser({
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 md:p-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <Image
              src={process.env.NEXT_PUBLIC_SCHOOL_LOGO!}
              alt="School Logo"
              width={520}
              height={70}
            />
          </Link>
          <h1 className="text-2xl font-bold text-center my-4">
            Login to continue
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex justify-between" htmlFor="password">
              Password
              <p className="text-sm text-end text-gray-600">
                <Link
                  href="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgotten password?
                </Link>
              </p>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Your very secure password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white py-2 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}
