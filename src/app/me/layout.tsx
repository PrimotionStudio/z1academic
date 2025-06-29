"use client";
import React, { useEffect } from "react";
import { useUserStore } from "@/lib/userStore";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Settings,
  LogOut,
  User,
  MessageSquareCode,
  BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "sonner";
import { Rock_Salt } from "next/font/google";
import Image from "next/image";

const rockSalt = Rock_Salt({
  weight: "400",
  subsets: ["latin"],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loadUserFromCookie, logout } = useUserStore();

  useEffect(() => {
    if (!user) loadUserFromCookie();
  }, [user, loadUserFromCookie]);

  const routeLength = pathname.split("/").length;
  const activeRoute = pathname.split("/")[2] || "";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100 w-full">
        <Sidebar>
          <SidebarHeader className="p-4 bg-white">
            <Link href="/me" className="flex items-center gap-2">
              <Image
                src={process.env.NEXT_PUBLIC_SCHOOL_LOGO2!}
                alt="School Logo"
                width={200}
                height={50}
              />
            </Link>
          </SidebarHeader>
          <SidebarContent className="flex flex-col justify-between p-4 h-[calc(100vh-4rem)] bg-primary">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start ${routeLength === 2 && pathname.split("/")[1].startsWith("me") && "bg-accent"}`}
                asChild
              >
                <Link href="/me">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeRoute.startsWith("departments") && "bg-accent"}`}
                asChild
              >
                <Link href="/me/departments">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Faculties & Departments
                </Link>
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeRoute.startsWith("courses") && "bg-accent"}`}
                asChild
              >
                <Link href="/me/courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Courses
                </Link>
              </Button>
              {/* <Button
                variant="ghost"
                className={`w-full justify-start ${activeRoute.startsWith("electives") && "bg-accent"}`}
                asChild
              >
                <Link href="/me/electives">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Electives
                </Link>
              </Button> */}
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeRoute.startsWith("resources") && "bg-accent"}`}
                asChild
              >
                <Link href="/me/resources">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Resources
                </Link>
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeRoute.startsWith("timetable") && "bg-accent"}`}
                asChild
              >
                <Link href="/me/timetable">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Timetable
                </Link>
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeRoute.startsWith("settings") && "bg-accent"}`}
                asChild
              >
                <Link href="/me/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </nav>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <div className="flex items-center justify-between border-b bg-white px-6 py-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="items-center gap-2 hidden lg:flex">
              <h1 className="text-xl font-semibold">{user?.fullName}</h1>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div className="ml-auto flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="relative rounded-full"
                  >
                    {user?.photo ? (
                      <Image
                        src={user.photo}
                        alt={user.fullName}
                        width={30}
                        height={30}
                        className="object-cover h-[30px] w-[30px] rounded-full"
                      />
                    ) : (
                      <Avatar className="h-[30px] w-[30px]">
                        <AvatarFallback className="font-bold">
                          {user?.fullName
                            .split(" ")
                            .splice(0, 2)
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/me">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/me/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="bg-red-800 text-white"
                      onClick={async () => {
                        await logout();
                        router.push("/");
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="p-3 lg:p-6 w-screen lg:w-full">{children}</div>
        </main>
        <Toaster position="top-center" richColors />
      </div>
    </SidebarProvider>
  );
}
