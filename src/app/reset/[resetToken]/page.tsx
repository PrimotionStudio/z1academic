"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchEmailByToken, forgotUser, resetPassword } from "@/functions/User";
import { toast } from "sonner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function StudentRegistration() {
  const router = useRouter();
  const { resetToken } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (typeof resetToken !== "string") return;
      fetchEmailByToken(resetToken)
        .then((email) => setEmail(email))
        .catch((error) => {
          toast.error((error as Error).message);
          router.push("/login");
        });
    })();
  }, [resetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      typeof resetToken !== "string" ||
      !email ||
      !password ||
      !confirmPassword
    )
      return;
    setIsSubmitting(true);
    await resetPassword(email, resetToken, password, confirmPassword)
      .then((_) => router.push("/login"))
      .catch((error) => toast.error((error as Error).message))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 md:p-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-white">
                Z1
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-center my-4">
            Lets help you change your password
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
              value={email}
              onChange={(_) => ""}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white py-2 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </main>
  );
}
