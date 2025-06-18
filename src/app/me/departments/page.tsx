"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addNewDepartment,
  editDepartment as EditDepartment,
  getAllDepartments,
} from "@/functions/Department";
import {
  addNewFaculty,
  editFaculty as EditFaculty,
  getAllFaculties,
} from "@/functions/Faculty";
import { Department, InputDepartment } from "@/types/Department";
import { Faculty } from "@/types/Faculty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  BookOpen,
  CheckCircle,
  Edit,
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FacultyDepartmentPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [delClass, setDelClass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [facultyName, setFacultyName] = useState("");
  const [editDepartmentInfo, setEditDepartmentInfo] = useState<
    InputDepartment & { departmentId: string }
  >({
    departmentId: "",
    facultyId: "",
    maxLevels: 400,
    name: "",
    programTitle: "",
  });
  const [editFacultyInfo, setEditFacultyInfo] = useState({
    facultyId: "",
    facultyName: "",
  });
  const [department, setDepartment] = useState<InputDepartment>({
    facultyId: "",
    maxLevels: 400,
    name: "",
    programTitle: "",
  });
  const [delFaculty, setDelFaculty] = useState("");
  const [className, setClassName] = useState("");
  const [departmentLevels, setDepartmentLevels] = useState(4);

  async function fetchFaculty() {
    await getAllFaculties().then((faculties) => setFaculties(faculties));
  }

  async function fetchDepartments() {
    await getAllDepartments().then((departments) =>
      setDepartments(departments),
    );
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetching(true);
        await Promise.all([fetchFaculty(), fetchDepartments()]);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, []);

  async function editFaculty(editFacultyName: {
    facultyId: string;
    facultyName: string;
  }) {
    if (!editFacultyName.facultyId || !editFacultyName.facultyName) return;
    setIsLoading(true);
    await EditFaculty(editFacultyName.facultyId, editFacultyName.facultyName)
      .then(async (message) => {
        await fetchFaculty();
        toast.success(message);
        setEditFacultyInfo({ facultyId: "", facultyName: "" });
      })
      .catch((error) => toast.error((error as Error).message))
      .finally(() => setIsLoading(false));
  }

  async function editDepartment(
    department: InputDepartment & { departmentId: string },
  ) {
    if (
      !department.departmentId ||
      !department.facultyId ||
      !department.name ||
      !department.programTitle ||
      department.maxLevels % 100 !== 0
    )
      return;
    setIsLoading(true);
    await EditDepartment(department)
      .then(async (message) => {
        await fetchDepartments();
        toast.success(message);
        setEditDepartmentInfo({
          departmentId: "",
          facultyId: "",
          maxLevels: 400,
          name: "",
          programTitle: "",
        });
      })
      .catch((error) => toast.error((error as Error).message))
      .finally(() => setIsLoading(false));
  }

  async function createFaculty(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    await addNewFaculty(facultyName)
      .then(async (message) => {
        toast.success(message);
        await fetchFaculty();
      })
      .catch((error) => toast.error((error as Error).message))
      .finally(() => setIsLoading(false));
  }

  async function createDepartment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !department.facultyId ||
      !department.name ||
      !department.programTitle ||
      department.maxLevels % 100 !== 0
    )
      return;
    setIsLoading(true);
    await addNewDepartment(department)
      .then(async (message) => {
        toast.success(message);
        await fetchDepartments();
      })
      .catch((error) => toast.error((error as Error).message))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-xl md:text-3xl font-semibold md:font-bold tracking-tight">
          Faculty & Departments
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Faculty</DialogTitle>
              <DialogDescription>
                Enter the details for the new faculty
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={createFaculty}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="facultyName">Faculty Name</Label>
                  <Input
                    id="facultyName"
                    placeholder="Enter faculty name"
                    onChange={(e) => setFacultyName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Faculty"}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isFetching && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {!isFetching && faculties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No Faculty found</h3>
            <p className="text-muted-foreground mt-1">
              Cannot find faculty, please try again!
            </p>
          </CardContent>
        </Card>
      )}

      <Accordion type="multiple" className="w-full">
        {faculties.map((faculty, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="font-semibold hover:no-underline border px-3 mb-3 rounded bg-white">
              <div className="flex flex-row items-center justify-between">
                {editFacultyInfo.facultyId === faculty._id ? (
                  <>
                    <Input
                      placeholder="Enter faculty name"
                      value={editFacultyInfo.facultyName}
                      onChange={(e) =>
                        setEditFacultyInfo({
                          ...editFacultyInfo,
                          facultyName: e.target.value,
                        })
                      }
                    />
                    <CheckCircle
                      className="h-7 w-7 ml-2"
                      onClick={() => editFaculty(editFacultyInfo)}
                    />
                  </>
                ) : (
                  <>
                    {faculty.name}
                    <Edit
                      className="h-5 w-5 ml-2"
                      onClick={() =>
                        setEditFacultyInfo({
                          facultyName: faculty.name,
                          facultyId: faculty._id,
                        })
                      }
                    />
                  </>
                )}
                <Badge className="ml-5" variant="outline">
                  {
                    departments.filter(
                      (department) => department.facultyId === faculty._id,
                    ).length
                  }{" "}
                  Departments
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() =>
                        setDepartment({ ...department, facultyId: faculty._id })
                      }
                    >
                      <Plus className="h-4 w-4" /> Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        Add Department to {faculty.name}
                      </DialogTitle>
                      <DialogDescription>
                        Enter the details for the new department
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => createDepartment(e)}
                    >
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="departmentName">
                            Department Name
                          </Label>
                          <Input
                            id="departmentName"
                            placeholder="Enter department name"
                            value={department.name}
                            onChange={(e) =>
                              setDepartment({
                                ...department,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="levels">
                            Max Number of Department Levels
                          </Label>
                          <Input
                            id="levels"
                            type="number"
                            placeholder="Enter the max number of levels in this department (eg. 400, 500)"
                            min="100"
                            max="1000"
                            step={100}
                            value={department.maxLevels}
                            onChange={(e) =>
                              setDepartment({
                                ...department,
                                maxLevels: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="programTitle">Program Title</Label>
                          <Input
                            id="programTitle"
                            placeholder="Enter program title (eg. BSc. Computer Science)"
                            value={department.programTitle}
                            onChange={(e) =>
                              setDepartment({
                                ...department,
                                programTitle: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Department"}
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4 pt-2 md:grid-cols-2 lg:grid-cols-3">
                {departments
                  .filter((department) => department.facultyId === faculty._id)
                  .map((department, i) => (
                    <Card key={i} className="overflow-hidden p-0 pt-5 bg-white">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>
                              {editDepartmentInfo.departmentId ===
                              department._id ? (
                                <Input
                                  placeholder="Enter department name"
                                  value={editDepartmentInfo.name}
                                  onChange={(e) =>
                                    setEditDepartmentInfo({
                                      ...editDepartmentInfo,
                                      name: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                department.name
                              )}
                            </CardTitle>
                            <CardDescription>
                              {editDepartmentInfo.departmentId ===
                              department._id ? (
                                <Input
                                  placeholder="Enter program title (eg. BSc. Computer Science)"
                                  value={editDepartmentInfo.programTitle}
                                  onChange={(e) =>
                                    setEditDepartmentInfo({
                                      ...editDepartmentInfo,
                                      programTitle: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                department.programTitle
                              )}
                            </CardDescription>
                            <CardDescription>
                              {/* {editDepartmentInfo.departmentId ===
                              department._id ? (
                                <Input
                                  type="number"
                                  placeholder="Enter the max number of levels in this department (eg. 400, 500)"
                                  min="100"
                                  max="1000"
                                  step={100}
                                  value={editDepartmentInfo.maxLevels}
                                  onChange={(e) =>
                                    setEditDepartmentInfo({
                                      ...editDepartmentInfo,
                                      maxLevels: Number(e.target.value),
                                    })
                                  }
                                />
                              ) : (
                                <>
                                  {department.maxLevels / 100} Levels (100 -{" "}
                                  {department.maxLevels})
                                </>
                              )} */}
                              {department.maxLevels / 100} Levels (100 -{" "}
                              {department.maxLevels})
                            </CardDescription>
                          </div>

                          {editDepartmentInfo.departmentId ===
                          department._id ? (
                            <CheckCircle
                              className="h-5 w-5 ml-2"
                              onClick={() => editDepartment(editDepartmentInfo)}
                            />
                          ) : (
                            <Edit
                              className="h-5 w-5 ml-2"
                              onClick={() =>
                                setEditDepartmentInfo({
                                  departmentId: department._id,
                                  facultyId: department.facultyId,
                                  maxLevels: department.maxLevels,
                                  name: department.name,
                                  programTitle: department.programTitle,
                                })
                              }
                            />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="px-6 pb-3">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-md bg-gray-100 p-2">
                            <div className="flex flex-col items-center">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <div className="text-xs font-medium">
                                Lecturers
                              </div>
                              <div className="text-lg font-bold">0</div>
                            </div>
                          </div>
                          <div className="rounded-md bg-gray-100 p-2">
                            <div className="flex flex-col items-center">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <div className="text-xs font-medium">
                                Students
                              </div>
                              <div className="text-lg font-bold">0</div>
                            </div>
                          </div>
                          <div className="rounded-md bg-gray-100 p-2">
                            <div className="flex flex-col items-center">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <div className="text-xs font-medium">Courses</div>
                              <div className="text-lg font-bold">0</div>
                            </div>
                          </div>
                        </div>
                        {/* <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4"
                          asChild
                        >
                          <Link href={`/me/departments/${department._id}`}>
                            View Department
                          </Link>
                        </Button> */}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
