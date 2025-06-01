"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getOneApplication, reviewApplication } from "@/functions/Application";
import { formatDate } from "@/lib/utils";
import { Application } from "@/types/Application";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ApplicationReview() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application>();

  useEffect(() => {
    if (typeof params.applicationId !== "string") return;
    getOneApplication(params.applicationId)
      .then((application) => setApplication(application))
      .catch((error) => {
        toast.error((error as Error).message);
        router.push("/me/applications");
      });
  }, [params.applicationId]);

  async function handleReview(
    applicationId: string,
    status: "Pending" | "Accepted" | "Rejected",
  ) {
    await reviewApplication(applicationId, status);
    await getOneApplication(applicationId)
      .then((application) => setApplication(application))
      .catch((error) => {
        toast.error((error as Error).message);
        router.push("/me/applications");
      });
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "Accepted":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Accepted
          </Badge>
        );
      case "Rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/me/applications">
            <Button className="bg-white" variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <Card className="mt-8 max-w-3xl mx-auto bg-white">
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-xl font-semibold">Review Application</div>
              {application && getStatusBadge(application.status)}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Personal Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-3">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Fullname
                    </dt>
                    <dd>{application?.userId.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Email
                    </dt>
                    <dd>{application?.userId.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Phone number
                    </dt>
                    <dd>{application?.userId.phone}</dd>
                  </div>
                </dl>
                <Separator className="my-2" />
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-3">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Program
                    </dt>
                    <dd>
                      {application && formatProgramName(application.program)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Date of Birth
                    </dt>
                    <dd>
                      {application?.dateOfBirth
                        ? formatDate(application.dateOfBirth)
                        : "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      State of Origin
                    </dt>
                    <dd>{application?.stateOfOrigin}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      LGA
                    </dt>
                    <dd>{application?.lga}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Contact Address
                    </dt>
                    <dd>{application?.contactAddress}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Next of Kin
                    </dt>
                    <dd>{application?.nextOfKin}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Next of Kin Phone
                    </dt>
                    <dd>{application?.nextOfKinPhone}</dd>
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
                    <dd>{application?.examType}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Examination Number
                    </dt>
                    <dd>{application?.examNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Examination Year
                    </dt>
                    <dd>{application?.examYear}</dd>
                  </div>
                </dl>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Subjects and Grades
                  </h4>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                    {application?.subjects
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
                    {application?.resultFile && application.resultFile.url ? (
                      <Link
                        className="underline text-primary"
                        href={application.resultFile.url}
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
              <p className="text-sm">
                Application submitted on:{" "}
                {application && formatDate(application.createdAt)}
              </p>
            </div>
            {application && application.status === "Pending" && (
              <div className="flex justify-between">
                <Button
                  onClick={() => handleReview(application._id, "Rejected")}
                  variant="destructive"
                >
                  Reject Application
                </Button>
                <Button
                  onClick={() => handleReview(application._id, "Accepted")}
                >
                  Accept Application
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
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
