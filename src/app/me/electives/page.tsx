"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
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
import { Edit, Plus, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { User } from "@/types/User";
import { toast } from "sonner";
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
import { Elective, InputElective } from "@/types/Elective";
import {
  addElective as AddElective,
  editElective as EditElective,
  getAllElectives,
} from "@/functions/Elective";

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
  const [electives, setElectives] = useState<Elective[]>([]);
  const [editElective, setEditElective] = useState<InputElective>({
    course: "",
    department: "",
    level: 100,
    semester: "",
  });
  const [elective, setElective] = useState<InputElective>({
    course: "",
    department: "",
    level: 100,
    semester: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        await Promise.all([
          getAllPeriods().then((periods) => setPeriods(periods)),
          getAllCourses().then((courses) => setCourses(courses)),
          getAllElectives().then((electives) => setElectives(electives)),
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

  async function addElective() {
    try {
      await AddElective(elective).then((message) => {
        getAllElectives().then((electives) => setElectives(electives));
        toast.success(message);
      });
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  async function editElectiveFunc(
    electiveId: string,
    electiveData: InputElective,
  ) {
    if (!electiveId) return;
    try {
      await EditElective(electiveId, electiveData).then((message) => {
        getAllElectives().then((electives) => setElectives(electives));
        toast.success(message);
      });
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  const filteredElectives = electives.filter((elective) => {
    const matchesSearch =
      elective.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      elective.course.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" ||
      elective.department._id === selectedDepartment;
    const matchesLevel =
      selectedLevel === "all" ||
      elective.level.toString() === selectedLevel.toString();
    const matchesSemester =
      selectedPeriod === "all" || elective.semester._id === selectedPeriod;
    return (
      matchesSearch && matchesDepartment && matchesLevel && matchesSemester
    );
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center flex-wrap mb-3">
        <h1 className="text-xl md:text-3xl font-semibold md:font-bold tracking-tight">
          Electives
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> Elective
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Elective</DialogTitle>
              <DialogDescription>
                Enter the details for the elective
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={addElective}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={elective.department}
                    onValueChange={(department) =>
                      setElective({ ...elective, department })
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
                        (department) => department._id === elective.department,
                      )?.maxLevels || 1000
                    }
                    value={elective.level}
                    onChange={(e) =>
                      setElective({
                        ...elective,
                        level: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={elective.semester}
                    onValueChange={(semester) =>
                      setElective({ ...elective, semester })
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
                  <Label htmlFor="course">Course</Label>
                  <Select
                    value={elective.course}
                    onValueChange={(course) =>
                      setElective({ ...elective, course })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {courses
                        .filter(
                          (c) =>
                            c.departmentId._id !== elective.department &&
                            c.semesterId._id === elective.semester,
                        )
                        .map((course, i) => (
                          <SelectItem key={i} value={course._id}>
                            {course.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {(() => {
                    const course = courses.find(
                      (c) =>
                        c._id === elective.course &&
                        c.departmentId._id !== elective.department,
                    );
                    if (!course) return;
                    return (
                      <>
                        <div className="space-y-2">
                          <Label>Course Original Department</Label>
                          <Input
                            value={course.departmentId.name}
                            onChange={() => ""}
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Lecturer</Label>
                          <Input
                            value={course.lecturer.userId.fullName}
                            onChange={() => ""}
                            readOnly
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Elective"}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>All Electives</CardTitle>
          <CardDescription>
            View and manage all electives. Use the filters to narrow down
            results.
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
                  <TableHead>Course Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Lecturer</TableHead>
                  <TableHead>Course Original Department</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Added on</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredElectives.length > 0 ? (
                  filteredElectives.map((elective, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell>{elective.course.name}</TableCell>
                      <TableCell>{elective.course.code}</TableCell>
                      <TableCell>{elective.course.units}</TableCell>
                      <TableCell>
                        {elective.course.lecturer.userId.fullName}
                      </TableCell>
                      <TableCell>{elective.course.departmentId.name}</TableCell>
                      <TableCell>{elective.department.name}</TableCell>
                      <TableCell>{elective.level}</TableCell>
                      <TableCell>{elective.semester.name}</TableCell>
                      <TableCell>{formatDate(elective.createdAt)}</TableCell>
                      <TableCell className="text-right flex justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant={"ghost"}
                              size={"icon"}
                              onClick={() =>
                                setEditElective({
                                  ...elective,
                                  department: elective.department._id,
                                  semester: elective.semester._id,
                                  level: elective.level,
                                  course: elective.course._id,
                                })
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Elective</DialogTitle>
                              <DialogDescription>
                                Update elective details
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              className="space-y-4"
                              onSubmit={(e) => {
                                e.preventDefault();
                                editElectiveFunc(elective._id, editElective);
                              }}
                            >
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="department">Department</Label>
                                  <Select
                                    value={editElective.department}
                                    onValueChange={(department) =>
                                      setEditElective({
                                        ...editElective,
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
                                          editElective.department,
                                      )?.maxLevels || 1000
                                    }
                                    value={editElective.level}
                                    onChange={(e) =>
                                      setEditElective({
                                        ...editElective,
                                        level: Number(e.target.value),
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="semester">Semester</Label>
                                  <Select
                                    value={editElective.semester}
                                    onValueChange={(semester) =>
                                      setEditElective({
                                        ...editElective,
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
                                  <Select
                                    value={editElective.course}
                                    onValueChange={(course) =>
                                      setEditElective({
                                        ...editElective,
                                        course,
                                      })
                                    }
                                    required
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Course" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                      {courses
                                        .filter(
                                          (c) =>
                                            c.departmentId._id !==
                                              editElective.department &&
                                            c.semesterId._id ===
                                              editElective.semester,
                                        )
                                        .map((course, i) => (
                                          <SelectItem
                                            key={i}
                                            value={course._id}
                                          >
                                            {course.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                  {(() => {
                                    const course = courses.find(
                                      (c) =>
                                        c._id === editElective.course &&
                                        c.departmentId._id !==
                                          editElective.department,
                                    );
                                    if (!course) return;
                                    return (
                                      <>
                                        <div className="space-y-2">
                                          <Label>
                                            Course Original Department
                                          </Label>
                                          <Input
                                            value={course.departmentId.name}
                                            onChange={() => ""}
                                            readOnly
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Lecturer</Label>
                                          <Input
                                            value={
                                              course.lecturer.userId.fullName
                                            }
                                            onChange={() => ""}
                                            readOnly
                                          />
                                        </div>
                                      </>
                                    );
                                  })()}
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
                      colSpan={11}
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
