"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, GraduationCap, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  DayOfWeek,
  InputTimetable,
  TimeSlot,
  Timetable,
  TimetableEntry,
} from "@/types/Timetable";
import { Course } from "@/types/Course";
import { Department } from "@/types/Department";
import { Period } from "@/types/Period";
import { getAllDepartments } from "@/functions/Department";
import { getAllPeriods } from "@/functions/Period";
import { getAllCourses } from "@/functions/Course";
import { getTimetable } from "@/functions/Timetable";

const DAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const TIME_SLOTS: TimeSlot[] = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

async function setTimeTable(timetable: InputTimetable) {
  const response = await fetch("/api/timetable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(timetable),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export default function TimetableSettings() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<Period[]>([]);
  const [level, setLevel] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [viewTimetable, setViewTimetable] = useState<InputTimetable | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canFetchTimetable = selectedDepartment && level && selectedSemester;

  useEffect(() => {
    Promise.all([
      getAllDepartments()
        .then((departments) => setDepartments(departments))
        .catch((error) => toast.error((error as Error).message)),
      getAllPeriods()
        .then((periods) => setSemesters(periods))
        .catch((error) => toast.error((error as Error).message)),
      getAllCourses()
        .then((courses) => setCourses(courses))
        .catch((error) => toast.error((error as Error).message)),
    ]);
  }, []);

  useEffect(() => {
    if (canFetchTimetable) {
      handleFetchTimetable();
    } else {
      setTimetable(null);
      setViewTimetable(null);
    }
  }, [selectedDepartment, level, selectedSemester]);

  const handleFetchTimetable = async () => {
    if (!canFetchTimetable) return;

    setIsLoading(true);
    try {
      const fetchedTimetable = await getTimetable(
        selectedDepartment,
        level,
        selectedSemester,
      );

      if (fetchedTimetable) {
        setTimetable(fetchedTimetable);
        const inputTimetable: InputTimetable = {
          department: selectedDepartment,
          semester: selectedSemester,
          level: Number.parseInt(level),
          entries: fetchedTimetable.entries.map((entry: TimetableEntry) => ({
            course: entry.course._id,
            day: entry.day,
            timeSlot: entry.timeSlot,
          })),
        };
        setViewTimetable(inputTimetable);
      } else {
        setTimetable(null);
        setViewTimetable(null);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewTimetable = () => {
    const newTimetable: InputTimetable = {
      department: selectedDepartment,
      semester: selectedSemester,
      level: Number.parseInt(level),
      entries: [],
    };
    setViewTimetable(newTimetable);
  };

  const handleCourseChange = (
    day: DayOfWeek,
    timeSlot: TimeSlot,
    courseId: string,
  ) => {
    if (!viewTimetable) return;

    const updatedEntries = viewTimetable.entries.filter(
      (entry) => !(entry.day === day && entry.timeSlot === timeSlot),
    );

    if (courseId && courseId !== "empty") {
      updatedEntries.push({
        course: courseId,
        day,
        timeSlot,
      });
    }

    setViewTimetable({
      ...viewTimetable,
      entries: updatedEntries,
    });
  };

  const getCourseForSlot = (day: DayOfWeek, timeSlot: TimeSlot): string => {
    if (!viewTimetable) return "empty";
    console.log("viewTimetable.entries", viewTimetable.entries);
    const entry = viewTimetable.entries.find(
      (entry) => entry.day === day && entry.timeSlot === timeSlot,
    );
    return entry?.course || "empty";
  };

  const getCourseDetails = (courseId: string): Course | null => {
    return courses.find((course) => course._id === courseId) || null;
  };

  const handleSave = async () => {
    if (!viewTimetable) return;

    setIsSaving(true);
    try {
      await setTimeTable(viewTimetable);
      toast.success("Timetable saved successfully");
      await handleFetchTimetable();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedDepartmentName =
    departments.find((d) => d._id === selectedDepartment)?.name || "";
  const selectedSemesterName =
    semesters.find((s) => s._id === selectedSemester)?.name || "";

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Configure Timetable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {departments.map((dept, i) => (
                    <SelectItem key={i} value={dept._id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                type="number"
                className="w-full"
                placeholder="Enter level (e.g., 100)"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value).toString())}
                step="100"
                min="100"
                max={
                  departments.find((dept) => dept._id === selectedDepartment)
                    ?.maxLevels || "1000"
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {semesters.map((semester, i) => (
                    <SelectItem key={i} value={semester._id}>
                      {semester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {canFetchTimetable && (
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timetable
                </CardTitle>
                <div className="flex flex-col md:flex-row gap-2 mt-2">
                  <Badge variant="default">{selectedDepartmentName}</Badge>
                  <Badge variant="default">Level {level}</Badge>
                  <Badge variant="default">{selectedSemesterName}</Badge>
                </div>
              </div>
              {viewTimetable && (
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Timetable"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : !viewTimetable ? (
              <div className="flex flex-col items-center py-8">
                <p className="text-muted-foreground mb-4">
                  No timetable found for {selectedDepartmentName} Level {level}{" "}
                  - {selectedSemesterName}
                </p>
                <Button
                  onClick={handleCreateNewTimetable}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add New Timetable
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Time</TableHead>
                      {DAYS.map((day) => (
                        <TableHead
                          key={day}
                          className="text-center min-w-[150px]"
                        >
                          {day}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TIME_SLOTS.map((timeSlot) => (
                      <TableRow key={timeSlot}>
                        <TableCell className="font-medium bg-muted/50">
                          {timeSlot}
                        </TableCell>
                        {DAYS.map((day) => {
                          const selectedCourseId = getCourseForSlot(
                            day,
                            timeSlot,
                          );
                          const courseDetails = selectedCourseId
                            ? getCourseDetails(selectedCourseId)
                            : null;

                          return (
                            <TableCell
                              key={`${day}-${timeSlot}`}
                              className="p-2"
                            >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Select
                                    value={selectedCourseId || "empty"}
                                    onValueChange={(value) =>
                                      handleCourseChange(day, timeSlot, value)
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select course" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                      <SelectItem value="empty">
                                        <span className="text-muted-foreground">
                                          No Class
                                        </span>
                                      </SelectItem>
                                      {courses
                                        .filter(
                                          (c) =>
                                            c.departmentId._id ===
                                              selectedDepartment &&
                                            c.semesterId._id ===
                                              selectedSemester &&
                                            Number(c.level) === Number(level),
                                        )
                                        .map((course) => (
                                          <SelectItem
                                            key={course._id}
                                            value={course._id}
                                          >
                                            <div className="flex flex-col">
                                              <span className="font-medium">
                                                {course.code}
                                              </span>
                                              <span className="text-xs text-muted-foreground truncate">
                                                {course.name}
                                              </span>
                                            </div>
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </TooltipTrigger>
                                {courseDetails && (
                                  <TooltipContent>
                                    <div className="text-sm">
                                      <p className="font-medium">
                                        {courseDetails.name}
                                      </p>
                                      <p className="text-muted-foreground">
                                        Lecturer:{" "}
                                        {courseDetails.lecturer.userId.fullName}
                                      </p>
                                    </div>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!canFetchTimetable && (
        <Card className="bg-white">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Please select department, enter level, and choose semester to view
              or create a timetable.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
