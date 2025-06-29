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
  BookOpen,
  CheckCircle,
  Edit,
  FileText,
  GraduationCap,
  Plus,
  Users,
  Building2,
  Target,
} from "lucide-react";
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
    jambCutOff: 150,
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
    jambCutOff: 150,
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
          jambCutOff: 150,
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
        setFacultyName("");
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
        setDepartment({
          facultyId: "",
          maxLevels: 400,
          jambCutOff: 150,
          name: "",
          programTitle: "",
        });
      })
      .catch((error) => toast.error((error as Error).message))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold text-primary">
              Faculty & Departments
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              Manage your institution's academic structure
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Faculty
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Create New Faculty
                </DialogTitle>
                <DialogDescription className="text-slate-600">
                  Enter the details for the new faculty
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={createFaculty}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="facultyName"
                      className="text-sm font-medium"
                    >
                      Faculty Name
                    </Label>
                    <Input
                      id="facultyName"
                      placeholder="Enter faculty name"
                      value={facultyName}
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
      </div>

      {/* Loading State */}
      {isFetching && (
        <div className="flex justify-center items-center py-12">
          {" "}
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>{" "}
        </div>
      )}

      {/* Empty State */}
      {!isFetching && faculties.length === 0 && (
        <Card className="border-dashed border-2 border-slate-300 bg-white/50 py-0">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-slate-100 rounded-full p-4 mb-4">
              <Building2 className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No Faculties Found
            </h3>
            <p className="text-slate-600 mb-6 max-w-md">
              Get started by creating your first faculty to organize your
              academic departments.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Faculty
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
                        value={facultyName}
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
          </CardContent>
        </Card>
      )}

      {/* Faculties Accordion */}
      <Accordion type="multiple" className="w-full space-y-4">
        {faculties.map((faculty, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="border-0 py-0 group"
          >
            <Card className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200/60">
              <AccordionTrigger className="hover:no-underline p-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full p-6 gap-4 py-0">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-primary rounded-xl p-3 shadow-lg">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      {editFacultyInfo.facultyId === faculty._id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Enter faculty name"
                            value={editFacultyInfo.facultyName}
                            onChange={(e) =>
                              setEditFacultyInfo({
                                ...editFacultyInfo,
                                facultyName: e.target.value,
                              })
                            }
                            className="text-lg font-semibold"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div
                            className="bg-green-600 hover:bg-green-700 text-white rounded-md p-2 cursor-pointer transition-colors shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              editFaculty(editFacultyInfo);
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                            {faculty.name}
                          </h3>
                          <div
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 rounded-md p-2 cursor-pointer shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditFacultyInfo({
                                facultyName: faculty.name,
                                facultyId: faculty._id,
                              });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 font-medium"
                  >
                    {
                      departments.filter(
                        (department) => department.facultyId === faculty._id,
                      ).length
                    }{" "}
                    {departments.filter(
                      (department) => department.facultyId === faculty._id,
                    ).length === 1
                      ? "Department"
                      : "Departments"}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                  <div className="flex justify-end mb-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() =>
                            setDepartment({
                              ...department,
                              facultyId: faculty._id,
                            })
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Department
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-semibold">
                            Add Department to {faculty.name}
                          </DialogTitle>
                          <DialogDescription className="text-slate-600">
                            Enter the details for the new department
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          className="space-y-4"
                          onSubmit={(e) => createDepartment(e)}
                        >
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="departmentName"
                                className="text-sm font-medium"
                              >
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
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label
                                  htmlFor="levels"
                                  className="text-sm font-medium"
                                >
                                  Max Levels
                                </Label>
                                <Input
                                  id="levels"
                                  type="number"
                                  placeholder="400"
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
                                <Label
                                  htmlFor="jambCutOff"
                                  className="text-sm font-medium"
                                >
                                  JAMB Cut Off
                                </Label>
                                <Input
                                  id="jambCutOff"
                                  type="number"
                                  placeholder="150"
                                  min="0"
                                  max="400"
                                  step={1}
                                  value={department.jambCutOff}
                                  onChange={(e) =>
                                    setDepartment({
                                      ...department,
                                      jambCutOff: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="programTitle"
                                className="text-sm font-medium"
                              >
                                Program Title
                              </Label>
                              <Input
                                id="programTitle"
                                placeholder="e.g., BSc. Computer Science"
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
                                {isLoading
                                  ? "Creating..."
                                  : "Create Department"}
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {departments
                      .filter(
                        (department) => department.facultyId === faculty._id,
                      )
                      .map((department, i) => (
                        <Card
                          key={i}
                          className="group hover:shadow-lg transition-all duration-200 bg-white border border-slate-200/60 overflow-hidden"
                        >
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 space-y-2">
                                {editDepartmentInfo.departmentId ===
                                department._id ? (
                                  <div className="space-y-2">
                                    <Input
                                      placeholder="Enter department name"
                                      value={editDepartmentInfo.name}
                                      onChange={(e) =>
                                        setEditDepartmentInfo({
                                          ...editDepartmentInfo,
                                          name: e.target.value,
                                        })
                                      }
                                      className="font-semibold text-base"
                                    />
                                    <Input
                                      placeholder="Enter program title"
                                      value={editDepartmentInfo.programTitle}
                                      onChange={(e) =>
                                        setEditDepartmentInfo({
                                          ...editDepartmentInfo,
                                          programTitle: e.target.value,
                                        })
                                      }
                                      className="text-sm"
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <CardTitle className="text-lg font-semibold text-slate-900 leading-tight">
                                      {department.name}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-slate-600">
                                      {department.programTitle}
                                    </CardDescription>
                                  </>
                                )}
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-slate-50 text-slate-700 border-slate-300"
                                  >
                                    <GraduationCap className="h-3 w-3 mr-1" />
                                    {department.maxLevels / 100} Levels
                                  </Badge>
                                  {editDepartmentInfo.departmentId ===
                                  department._id ? (
                                    <div className="flex items-center gap-1">
                                      <Target className="h-3 w-3 text-amber-600" />
                                      <Input
                                        type="number"
                                        placeholder="JAMB"
                                        min="0"
                                        max="400"
                                        step={1}
                                        value={editDepartmentInfo.jambCutOff}
                                        onChange={(e) =>
                                          setEditDepartmentInfo({
                                            ...editDepartmentInfo,
                                            jambCutOff: Number(e.target.value),
                                          })
                                        }
                                        className="text-xs h-6 w-full px-2 border-amber-300 focus:border-amber-500"
                                      />
                                    </div>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-amber-50 text-amber-700 border-amber-300"
                                    >
                                      <Target className="h-3 w-3 mr-1" />
                                      {department.jambCutOff} JAMB Cut Off
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {editDepartmentInfo.departmentId ===
                              department._id ? (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    editDepartment(editDepartmentInfo)
                                  }
                                  className="bg-green-600 hover:bg-green-700 shrink-0"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setEditDepartmentInfo({
                                      departmentId: department._id,
                                      facultyId: department.facultyId,
                                      maxLevels: department.maxLevels,
                                      name: department.name,
                                      jambCutOff: department.jambCutOff,
                                      programTitle: department.programTitle,
                                    })
                                  }
                                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center border border-blue-200/50">
                                <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                                <div className="text-xs font-medium text-blue-700 mb-1">
                                  Lecturers
                                </div>
                                <div className="text-lg font-bold text-blue-900">
                                  0
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3 text-center border border-emerald-200/50">
                                <Users className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                                <div className="text-xs font-medium text-emerald-700 mb-1">
                                  Students
                                </div>
                                <div className="text-lg font-bold text-emerald-900">
                                  0
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 text-center border border-amber-200/50">
                                <BookOpen className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                                <div className="text-xs font-medium text-amber-700 mb-1">
                                  Courses
                                </div>
                                <div className="text-lg font-bold text-amber-900">
                                  0
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
