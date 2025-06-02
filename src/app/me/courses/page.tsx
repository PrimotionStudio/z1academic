"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Ellipsis, Eye, Plus, Search } from "lucide-react";
import { Application } from "@/types/Application";
import { formatDate } from "@/lib/utils";
import { User } from "@/types/User";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Department } from "@/types/Department";
import { getAllDepartments } from "@/functions/Department";
import { Label } from "@/components/ui/label";
import { Course, InputCourse } from "@/types/Course";
import { Period } from "@/types/Period";
import { Lecturer } from "@/types/Lecturer";
import { getAllLecturer } from "@/functions/Lecturer";
import { getAllPeriods } from "@/functions/Period";
import {
  addNewCourse,
  getAllCourses,
  editCourse as EditCourse,
} from "@/functions/Course";

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState<number | "all">("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState<InputCourse>({
    code: "",
    department: "",
    lecturer: "",
    level: 100,
    name: "",
    semester: "",
    units: 1,
  });
  const [editCourseInfo, setEditCourseInfo] = useState<InputCourse>({
    code: "",
    department: "",
    lecturer: "",
    level: 100,
    name: "",
    semester: "",
    units: 1,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        await Promise.all([
          getAllPeriods().then((periods) => setPeriods(periods)),
          getAllCourses().then((courses) => setCourses(courses)),
          getAllLecturer().then((lecturers) => setLecturers(lecturers)),
          getAllDepartments().then((departments) =>
            setDepartments(departments),
          ),
        ]);
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
    fetchData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Number(course.units)
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      course.lecturer.userId.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" ||
      course.departmentId._id === selectedDepartment;
    const matchesLevel =
      selectedLevel === "all" ||
      course.level.toString() === selectedLevel.toString();
    const matchesSemester =
      selectedPeriod === "all" || course.semesterId._id === selectedPeriod;
    return (
      matchesSearch && matchesDepartment && matchesLevel && matchesSemester
    );
  });

  async function editCourse(courseId: string, course: InputCourse) {
    try {
      await EditCourse(courseId, course).then((message) => {
        toast.success(message);
        getAllCourses().then((courses) => setCourses(courses));
        setEditCourseInfo({
          code: "",
          department: "",
          lecturer: "",
          level: 100,
          name: "",
          semester: "",
          units: 1,
        });
      });
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addNewCourse(course).then((message) => {
        toast.success(message);
        getAllCourses().then((courses) => setCourses(courses));
        setCourse({
          code: "",
          department: "",
          lecturer: "",
          level: 100,
          name: "",
          semester: "",
          units: 1,
        });
      });
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center flex-wrap mb-3">
        <h1 className="text-xl md:text-3xl font-semibold md:font-bold tracking-tight">
          Courses
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> Course
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Enter the details for the new course
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={createCourse}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={course.department}
                    onValueChange={(department) =>
                      setCourse({ ...course, department })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {departments.map((department, i) => (
                        <SelectItem key={i} value={department._id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseLevel">Course Level</Label>
                  <Input
                    id="courseLevel"
                    placeholder="Enter Course level"
                    type="number"
                    step={100}
                    min={100}
                    max={
                      departments.find(
                        (department) => department._id === course.department,
                      )?.maxLevels || 1000
                    }
                    value={course.level}
                    onChange={(e) =>
                      setCourse({ ...course, level: Number(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={course.semester}
                    onValueChange={(semester) =>
                      setCourse({ ...course, semester })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {periods.map((period, i) => (
                        <SelectItem key={i} value={period._id}>
                          {period.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    placeholder="Enter Course name"
                    value={course.name}
                    onChange={(e) =>
                      setCourse({ ...course, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input
                    id="courseCode"
                    placeholder="Enter Course code"
                    value={course.code}
                    onChange={(e) =>
                      setCourse({ ...course, code: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseUnits">Course Units</Label>
                  <Input
                    id="courseUnits"
                    placeholder="Enter Course unit"
                    value={course.units}
                    type="number"
                    onChange={(e) =>
                      setCourse({ ...course, units: Number(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lecturer">Lecturer</Label>
                  <Select
                    value={course.lecturer}
                    onValueChange={(selectedLecturer) =>
                      setCourse({ ...course, lecturer: selectedLecturer })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Lecturer" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {lecturers
                        .filter(
                          (lecturer) =>
                            lecturer.department === course.department,
                        )
                        .map((lecturer, i) => (
                          <SelectItem key={i} value={lecturer._id}>
                            {lecturer.userId.fullName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Course"}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
          <CardDescription>
            View and manage all courses. Use the filters to narrow down results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, code, lecturer, units or level"
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="gap-2 grid grid-cols-2 md:grid-cols-3">
              <Select
                value={selectedDepartment}
                onValueChange={(department) =>
                  setSelectedDepartment(department)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((department, i) => (
                    <SelectItem key={i} value={department._id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedLevel as string}
                onValueChange={(level) =>
                  setSelectedLevel(level as number | "all")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Level</SelectItem>
                  {Array.from(
                    {
                      length:
                        (departments.find(
                          (department) => department._id === selectedDepartment,
                        )?.maxLevels || 1000) / 100,
                    },
                    (_, i) => (i + 1) * 100,
                  ).map((level) => (
                    <SelectItem key={level} value={String(level)}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedPeriod}
                onValueChange={(period) => setSelectedPeriod(period)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Period</SelectItem>
                  {periods.map((period, i) => (
                    <SelectItem key={i} value={period._id}>
                      {period.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Lecturer</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Registered on</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.units}</TableCell>
                      <TableCell>{course.lecturer.userId.fullName}</TableCell>
                      <TableCell>{course.departmentId.name}</TableCell>
                      <TableCell>{course.level}</TableCell>
                      <TableCell>{course.semesterId.name}</TableCell>
                      <TableCell>{formatDate(course.createdAt)}</TableCell>
                      <TableCell className="text-right flex justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant={"ghost"}
                              size={"icon"}
                              onClick={() =>
                                setEditCourseInfo({
                                  ...course,
                                  department: course.departmentId._id,
                                  semester: course.semesterId._id,
                                  lecturer: course.lecturer._id,
                                })
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Course</DialogTitle>
                              <DialogDescription>
                                Update course details
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              className="space-y-4"
                              onSubmit={(e) => {
                                e.preventDefault();
                                editCourse(course._id, editCourseInfo);
                              }}
                            >
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="department">Department</Label>
                                  <Select
                                    value={editCourseInfo.department}
                                    onValueChange={(department) =>
                                      setEditCourseInfo({
                                        ...editCourseInfo,
                                        department,
                                      })
                                    }
                                    required
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Department" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                      {departments.map((department, i) => (
                                        <SelectItem
                                          key={i}
                                          value={department._id}
                                        >
                                          {department.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="courseLevel">
                                    Course Level
                                  </Label>
                                  <Input
                                    id="courseLevel"
                                    placeholder="Enter Course level"
                                    type="number"
                                    step={100}
                                    min={100}
                                    max={
                                      departments.find(
                                        (department) =>
                                          department._id ===
                                          editCourseInfo.department,
                                      )?.maxLevels || 1000
                                    }
                                    value={editCourseInfo.level}
                                    onChange={(e) =>
                                      setEditCourseInfo({
                                        ...editCourseInfo,
                                        level: Number(e.target.value),
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="semester">Semester</Label>
                                  <Select
                                    value={editCourseInfo.semester}
                                    onValueChange={(semester) =>
                                      setEditCourseInfo({
                                        ...editCourseInfo,
                                        semester,
                                      })
                                    }
                                    required
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Semester" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                      {periods.map((period, i) => (
                                        <SelectItem key={i} value={period._id}>
                                          {period.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="courseName">
                                    Course Name
                                  </Label>
                                  <Input
                                    id="courseName"
                                    placeholder="Enter Course name"
                                    value={editCourseInfo.name}
                                    onChange={(e) =>
                                      setEditCourseInfo({
                                        ...editCourseInfo,
                                        name: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="courseCode">
                                    Course Code
                                  </Label>
                                  <Input
                                    id="courseCode"
                                    placeholder="Enter Course code"
                                    value={editCourseInfo.code}
                                    onChange={(e) =>
                                      setEditCourseInfo({
                                        ...editCourseInfo,
                                        code: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="courseUnits">
                                    Course Units
                                  </Label>
                                  <Input
                                    id="courseUnits"
                                    placeholder="Enter Course unit"
                                    value={editCourseInfo.units}
                                    type="number"
                                    onChange={(e) =>
                                      setEditCourseInfo({
                                        ...editCourseInfo,
                                        units: Number(e.target.value),
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="lecturer">Lecturer</Label>
                                  <Select
                                    value={editCourseInfo.lecturer}
                                    onValueChange={(selectedLecturer) =>
                                      setEditCourseInfo({
                                        ...editCourseInfo,
                                        lecturer: selectedLecturer,
                                      })
                                    }
                                    required
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Lecturer" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                      {lecturers
                                        .filter(
                                          (lecturer) =>
                                            lecturer.department ===
                                            editCourseInfo.department,
                                        )
                                        .map((lecturer, i) => (
                                          <SelectItem
                                            key={i}
                                            value={lecturer._id}
                                          >
                                            {lecturer.userId.fullName}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Updating..." : "Edit Course"}
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No course found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
