"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/lib/userStore";
import { formatDate } from "@/lib/utils";
import { ReviewFormProps } from "@/types/Application";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AlertCircle, CreditCard } from "lucide-react";

export function ReviewForm({
  applicationData: applicationData,
  updateData,
  onPrevious,
  onSubmit,
}: ReviewFormProps) {
  const { user, loadUserFromCookie } = useUserStore();
  const handleTermsChange = (checked: boolean) => {
    updateData({ termsAccepted: checked });
  };
  useEffect(() => {
    if (!user) loadUserFromCookie();
  }, [user, loadUserFromCookie]);

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Review Your Application</div>

      <div className="space-y-6">
        {!user ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium">Basic Information</h3>
            <Separator className="my-2" />
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Full name
                </dt>
                <dd>{user.fullName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Photo
                </dt>
                <dd>
                  <Image
                    src={user.photo}
                    alt={user.fullName}
                    width={100}
                    height={100}
                    className="object-cover rounded-circle"
                  />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Email
                </dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground"></dt>
                <dd></dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </dt>
                <dd>{user.phone}</dd>
              </div>
            </dl>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium">Personal Information</h3>
          <Separator className="my-2" />
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-3">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Program
              </dt>
              <dd>{formatProgramName(applicationData.program)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Date of Birth
              </dt>
              <dd>
                {applicationData.dateOfBirth
                  ? formatDate(applicationData.dateOfBirth)
                  : "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                State of Origin
              </dt>
              <dd>{applicationData.stateOfOrigin}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">LGA</dt>
              <dd>{applicationData.lga}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">
                Contact Address
              </dt>
              <dd>{applicationData.contactAddress}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Next of Kin
              </dt>
              <dd>{applicationData.nextOfKin}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Next of Kin Phone
              </dt>
              <dd>{applicationData.nextOfKinPhone}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium">Educational Information</h3>
          <Separator className="my-2" />
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 mt-3">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Examination Type
              </dt>
              <dd>{applicationData.examType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Examination Number
              </dt>
              <dd>{applicationData.examNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Examination Year
              </dt>
              <dd>{applicationData.examYear}</dd>
            </div>
          </dl>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Subjects and Grades
            </h4>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
              {applicationData.subjects
                .filter((subject) => subject.subject && subject.grade)
                .map((subject, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{subject.subject}</span>
                    <span className="font-medium">{subject.grade}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Uploaded Result
            </h4>
            <p>
              {applicationData.resultFile ? (
                <Link
                  className="underline text-primary"
                  href={applicationData.resultFile.url}
                  target="_blank"
                >
                  Examination Result
                </Link>
              ) : (
                "No file uploaded"
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={applicationData.termsAccepted}
            onCheckedChange={handleTermsChange}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept Terms and Conditions
            </Label>
            <p className="text-sm text-muted-foreground">
              I confirm that all the information provided is accurate and
              complete. I understand that providing false information may result
              in the cancellation of my application.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={!applicationData.termsAccepted}>
              Submit Application
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex flex-row text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  Payment Required
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  You must complete your payment before continuing with your
                  application.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="my-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ₦15,000
              </div>
              <p className="text-sm text-gray-500">
                Application processing fee
              </p>
            </div>

            <DialogFooter className="flex flex-col gap-4 sm:flex-row">
              <DialogClose className="w-full sm:w-auto">Cancel</DialogClose>
              <Button onClick={onSubmit} className="w-full sm:w-auto">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function formatProgramName(programValue: string): string {
  switch (programValue) {
    case "bsc-computer-science":
      return "BSc. Computer Science";
    case "bsc-engineering":
      return "BSc. Engineering";
    case "bsc-mathematics":
      return "BSc. Mathematics";
    case "bsc-physics":
      return "BSc. Physics";
    case "bsc-economics":
      return "BSc. Economics";
    default:
      return programValue;
  }
}
