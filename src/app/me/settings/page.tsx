import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Hourglass, Key, School } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Separator />

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/me/settings/configuration">
              <Button
                variant="ghost"
                className="w-full justify-between h-auto p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <School className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Configuration</div>
                    <div className="text-sm text-muted-foreground">
                      Set and edit instituition's information
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/me/settings/session-period">
              <Button
                variant="ghost"
                className="w-full justify-between h-auto p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Hourglass className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Session & Period</div>
                    <div className="text-sm text-muted-foreground">
                      Set, edit and activate current academic calendar
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/me/settings/change-password">
              <Button
                variant="ghost"
                className="w-full justify-between h-auto p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Key className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Change Password</div>
                    <div className="text-sm text-muted-foreground">
                      Update your account password
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
