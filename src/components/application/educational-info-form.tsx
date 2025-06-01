"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subjects, grades } from "@/lib/education-data";
import { validateEducationalInfoForm } from "@/functions/Application";
import {
  InputApplicationData,
  ApplicationFormProps,
} from "@/types/Application";
import { toast } from "sonner";
import IKUploadImage from "../imagekit/upload";
import Link from "next/link";

export function EducationalInfoForm({
  applicationData,
  updateData,
  onNext,
  onPrevious,
}: ApplicationFormProps) {
  const [file, setFile] = useState({
    url: "",
    fileType: "",
  });

  useEffect(() => {
    if (!file.fileType || !file.url) return;
    updateData({
      resultFile: {
        url: file.url,
        fileType: file.fileType,
      },
    });
  }, [file]);

  const handleNext = () => {
    try {
      if (validateEducationalInfoForm(applicationData)) onNext();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const updateSubject = (
    index: number,
    field: "subject" | "grade",
    value: string,
  ) => {
    const updatedSubjects = [...applicationData.subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    updateData({ subjects: updatedSubjects });
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Educational Information</div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="examType">O'Level Examination Type</Label>
          <Select
            value={applicationData.examType}
            onValueChange={(value) => updateData({ examType: value })}
          >
            <SelectTrigger id="examType">
              <SelectValue placeholder="Select examination type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WAEC">WAEC</SelectItem>
              <SelectItem value="NECO">NECO</SelectItem>
              <SelectItem value="NABTEB">NABTEB</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="examNumber">Examination Number</Label>
            <Input
              id="examNumber"
              value={applicationData.examNumber}
              onChange={(e) => updateData({ examNumber: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="examYear">Examination Year</Label>
            <Select
              value={applicationData.examYear}
              onValueChange={(value) => updateData({ examYear: value })}
            >
              <SelectTrigger id="examYear">
                <SelectValue placeholder="Select examination year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: 10 },
                  (_, i) => new Date().getFullYear() - i,
                ).map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Subjects and Grades</Label>

          <div className="space-y-3 mt-2">
            {applicationData.subjects.map((subjectData, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Select
                  value={subjectData.subject}
                  onValueChange={(value) =>
                    updateSubject(index, "subject", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Subject ${index + 1}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={subjectData.grade}
                  onValueChange={(value) =>
                    updateSubject(index, "grade", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="resultFile">Upload Documents </Label>
          <p>
            <span className="text-sm">
              Combine multiple documents into a single PDF and upload
            </span>
          </p>
          <IKUploadImage
            variant={"outline"}
            setFilePath={setFile}
            buttonText="Upload Documents"
            className={`m-3`}
            accept=".pdf,.docx"
          />
          {applicationData.resultFile && applicationData.resultFile.url && (
            <p className="text-sm text-muted-foreground mt-1">
              File selected:{" "}
              <Link
                href={applicationData.resultFile.url}
                className="underline text-primary"
                target="_blank"
              >
                Uploaded Documents
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}
