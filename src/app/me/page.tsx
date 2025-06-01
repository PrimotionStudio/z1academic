"use client";
import { Check, Edit, Edit2, Mail, Phone, User, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/lib/userStore";
import { toast } from "sonner";
import { UserEditInfo } from "@/types/User";
import { validateEditUserForm } from "@/functions/User";
import UploadPhoto from "@/components/imagekit/uploadPhoto";
import Image from "next/image";

export default function AdminProfilePage() {
  const { user, loadUserFromCookie } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [userEditInfo, setUserEditInfo] = useState<UserEditInfo>({
    fullName: "",
    email: "",
    phone: "",
    photo: "",
  });

  useEffect(() => {
    if (!user) loadUserFromCookie();
  }, [user, loadUserFromCookie]);

  const handleEditClick = () => {
    setUserEditInfo({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      photo: user?.photo || "",
    });
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserEditInfo({
      ...userEditInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      validateEditUserForm(userEditInfo);
      const response = await fetch("/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userEditInfo),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      loadUserFromCookie();
      toast.success(data.message);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-10">
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          View and manage your profile information
        </p>
      </div>

      {!user ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <div className="space-y-6">
            <Card className="bg-white">
              <CardHeader className="flex flex-col items-center justify-center pt-6">
                <div className="relative">
                  {user.photo || userEditInfo.photo ? (
                    <Image
                      src={userEditInfo.photo || user.photo}
                      alt={userEditInfo.fullName || user.fullName}
                      width={100}
                      height={100}
                      className="object-cover rounded-circle"
                    />
                  ) : (
                    <Avatar className="h-28 w-28">
                      <AvatarFallback className="text-4xl font-bold">
                        {user.fullName
                          .split(" ")
                          .splice(0, 2)
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <UploadPhoto
                    onClick={handleEditClick}
                    setPhotoUrl={(url) => {
                      console.log(`url: ${url}`);
                      setUserEditInfo({ ...userEditInfo, photo: url });
                    }}
                  />
                </div>
                <CardTitle className="mt-4 text-center text-2xl">
                  {user.fullName}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>
                    {isEditing
                      ? "Edit your information below"
                      : "Your personal information"}
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="ghost" size="icon" onClick={handleEditClick}>
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Edit profile</span>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your name"
                      value={userEditInfo.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={userEditInfo.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="phone"
                      placeholder="Enter your phone number"
                      value={userEditInfo.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Name</span>
                    </div>
                    <p className="font-medium">{user.fullName}</p>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>Phone</span>
                    </div>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/40 px-6 py-4">
              <p className="text-xs text-muted-foreground">
                Last updated on {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
