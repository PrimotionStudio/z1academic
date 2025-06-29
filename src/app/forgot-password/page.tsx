"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotUser } from "@/functions/User";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function StudentRegistration() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await forgotUser(email)
      .then((message) => {
        toast.success(message);
        setEmail("");
      })
      .catch((error) => toast.error((error as Error).message))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 md:p-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <Image
              src={process.env.NEXT_PUBLIC_SCHOOL_LOGO!}
              alt="School Logo"
              width={220}
              height={70}
            />
          </Link>
          <h1 className="text-2xl font-bold text-center my-4">
            Lets help you recover account
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
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white py-2 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Recovery Email"}
          </Button>
        </form>
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            <Link
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Remember It?
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
