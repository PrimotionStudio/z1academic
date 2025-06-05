"use client";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getAllDepartments } from "@/functions/Department";
import {
  addNewGradeScheme,
  editGradeScheme,
  getAllGradeSchemes,
} from "@/functions/GradeScheme";
import { getAllPeriods } from "@/functions/Period";
import { cn, formatDate } from "@/lib/utils";
import { Department } from "@/types/Department";
import {
  AssessmentType,
  GradeScheme,
  InputGradeScheme,
} from "@/types/GradeScheme";
import { Period } from "@/types/Period";
import { AlertCircle, Check, Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AcademicSessions() {
  const [isAddGradeSchemeDialogOpen, setIsAddGradeSchemeDialogOpen] =
    useState(false);
  const [isEditGradeSchemeDialogOpen, setIsEditGradeSchemeDialogOpen] =
    useState(false);
  const [semesters, setSemesters] = useState<Period[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [gradeSchemes, setGradeSchemes] = useState<GradeScheme[]>([]);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<"all" | number>("all");
  const [filterSemester, setFilterSemester] = useState<string>("all");
  const [gradeScheme, setGradeScheme] = useState<InputGradeScheme>({
    department: "",
    semester: "",
    level: 100,
    assessmentTypes: [
      {
        name: "",
        score: 0,
      },
    ],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        await Promise.all([
          getAllPeriods().then((periods) => setSemesters(periods)),
          getAllDepartments().then((departments) =>
            setDepartments(departments),
          ),
          getAllGradeSchemes().then((gradeSchemes) =>
            setGradeSchemes(gradeSchemes),
          ),
        ]);
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
    fetchData();
  }, []);

  const totalScore = gradeScheme.assessmentTypes.reduce(
    (sum, assessment) => sum + assessment.score,
    0,
  );
  const isValidTotal = totalScore === 100;
  const canSave =
    gradeScheme.semester && gradeScheme.department && isValidTotal;

  const addAssessmentType = () => {
    setGradeScheme({
      ...gradeScheme,
      assessmentTypes: [...gradeScheme.assessmentTypes, { name: "", score: 0 }],
    });
  };

  const removeAssessmentType = (index: number) => {
    if (gradeScheme.assessmentTypes.length > 1) {
      const newAssessmentTypes = gradeScheme.assessmentTypes.filter(
        (_, i) => i !== index,
      );
      setGradeScheme({ ...gradeScheme, assessmentTypes: newAssessmentTypes });
    }
  };

  const updateAssessmentType = (
    index: number,
    field: keyof AssessmentType,
    value: string,
  ) => {
    const newAssessmentTypes = gradeScheme.assessmentTypes.map(
      (assessment, i) =>
        i === index
          ? {
              ...assessment,
              [field]: field === "score" ? Number(value) || 0 : value,
            }
          : assessment,
    );
    setGradeScheme({ ...gradeScheme, assessmentTypes: newAssessmentTypes });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    try {
      await addNewGradeScheme(gradeScheme).then(async (message) => {
        await getAllGradeSchemes().then((gradeSchemes) =>
          setGradeSchemes(gradeSchemes),
        );
        toast.success(message);
        setIsAddGradeSchemeDialogOpen(false);
        setGradeScheme({
          semester: "",
          department: "",
          level: 100,
          assessmentTypes: [{ name: "", score: 0 }],
        });
      });
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  async function editScheme() {
    if (!canSave) return;
    try {
      await editGradeScheme(gradeScheme).then(async (message) => {
        await getAllGradeSchemes().then((gradeSchemes) =>
          setGradeSchemes(gradeSchemes),
        );
        toast.success(message);
        setIsEditGradeSchemeDialogOpen(false);
        setGradeScheme({
          semester: "",
          department: "",
          level: 100,
          assessmentTypes: [{ name: "", score: 0 }],
        });
      });
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  const resetForm = () => {
    setGradeScheme({
      semester: "",
      department: "",
      level: 100,
      assessmentTypes: [{ name: "", score: 0 }],
    });
  };

  const isActive = (filter: string | number, value: string | number) =>
    String(filter) === "all" ||
    String(filter) === "" ||
    String(filter) === undefined ||
    String(filter) === String(value);

  const filteredSchemes = gradeSchemes.filter((scheme) => {
    return (
      isActive(filterDepartment, scheme.department._id) &&
      isActive(filterLevel, scheme.level) &&
      isActive(filterSemester, scheme.semester._id)
    );
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center flex-wrap mb-3">
        <h1 className="text-xl md:text-3xl font-semibold md:font-bold tracking-tight">
          Grade Schemes
        </h1>
        <Dialog
          open={isAddGradeSchemeDialogOpen}
          onOpenChange={setIsAddGradeSchemeDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> Grade Scheme
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Grade Scheme</DialogTitle>
              <DialogDescription>
                Define assessment types and their corresponding scores. The
                total score must equal 100.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-1">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="department"
                    className="text-sm font-medium text-gray-700"
                  >
                    Department
                  </Label>
                  <Select
                    value={gradeScheme.department}
                    onValueChange={(department) =>
                      setGradeScheme({ ...gradeScheme, department })
                    }
                  >
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {departments.map((department) => (
                        <SelectItem key={department._id} value={department._id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="level"
                    className="text-sm font-medium text-gray-700"
                  >
                    Academic Level
                  </Label>

                  <Input
                    id="level"
                    placeholder="Enter Department Level"
                    type="number"
                    step={100}
                    min={100}
                    max={
                      departments.find(
                        (department) =>
                          department._id === gradeScheme.department,
                      )?.maxLevels || 1000
                    }
                    value={gradeScheme.level}
                    onChange={(e) =>
                      setGradeScheme({
                        ...gradeScheme,
                        level: Number(e.target.value),
                      })
                    }
                    className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="academic-period"
                    className="text-sm font-medium text-gray-700"
                  >
                    Semester
                  </Label>
                  <Select
                    value={gradeScheme.semester}
                    onValueChange={(semester) =>
                      setGradeScheme({ ...gradeScheme, semester })
                    }
                  >
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {semesters.map((semester) => (
                        <SelectItem key={semester._id} value={semester._id}>
                          {semester.name}{" "}
                          {semester.isActive && (
                            <span className="text-green-600 font-medium">
                              (Active)
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">
                      Assessment Types
                    </Label>
                    <div
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full",
                        isValidTotal
                          ? "text-green-700 bg-green-100"
                          : "text-red-700 bg-red-100",
                      )}
                    >
                      {isValidTotal ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      Total: {totalScore}/100
                    </div>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {gradeScheme.assessmentTypes.map((assessment, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg border">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                          <div className="sm:col-span-7">
                            <Label
                              htmlFor={`assessment-${i}`}
                              className="text-xs text-gray-600 mb-1 block"
                            >
                              Assessment Type
                            </Label>
                            <Input
                              id={`assessment-${i}`}
                              placeholder="e.g., Quizzes, Exams, Assignments"
                              value={assessment.name}
                              onChange={(e) =>
                                updateAssessmentType(i, "name", e.target.value)
                              }
                              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <Label
                              htmlFor={`score-${i}`}
                              className="text-xs text-gray-600 mb-1 block"
                            >
                              Score (%)
                            </Label>
                            <Input
                              id={`score-${i}`}
                              type="number"
                              min="0"
                              max="100"
                              value={assessment.score || ""}
                              onChange={(e) =>
                                updateAssessmentType(i, "score", e.target.value)
                              }
                              placeholder="0"
                              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="sm:col-span-2 flex items-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeAssessmentType(i)}
                              disabled={
                                gradeScheme.assessmentTypes.length === 1
                              }
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAssessmentType}
                    className="w-full border-dashed border-2 hover:border-blue-300 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Assessment Type
                  </Button>
                </div>

                {!isValidTotal && totalScore > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700 text-center flex items-center justify-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Total score must equal 100% to save the grading scheme
                    </p>
                  </div>
                )}
              </form>
            </div>

            <DialogFooter className="flex-shrink-0 pt-4 border-t">
              <div className="flex flex-col justify-end sm:flex-row gap-2 w-full">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={!canSave}
                  onClick={handleSubmit}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 order-1 sm:order-2"
                >
                  Create Grading Scheme
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>All Grade Schemes</CardTitle>
          <CardDescription>
            View and manage all grade schemes. Use the filters to narrow down
            results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 flex-col lg:flex-row gap-4 mb-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Department
              </Label>
              <Select
                value={filterDepartment}
                onValueChange={setFilterDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department._id} value={department._id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Level</Label>
              <Select
                value={String(filterLevel)}
                onValueChange={(level) =>
                  setFilterLevel(level as number | "all")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All levels</SelectItem>
                  {Array.from(
                    {
                      length:
                        (departments.find(
                          (department) => department._id === filterDepartment,
                        )?.maxLevels || 1000) / 100,
                    },
                    (_, i) => (i + 1) * 100,
                  ).map((level, i) => (
                    <SelectItem key={i} value={String(level)}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Semester
              </Label>
              <Select value={filterSemester} onValueChange={setFilterSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="All semesters" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map((semester) => (
                    <SelectItem key={semester._id} value={semester._id}>
                      {semester.name}
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
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Scheme</TableHead>
                  <TableHead>Added on</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchemes.length > 0 ? (
                  filteredSchemes.map((scheme, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell>{scheme.department.name}</TableCell>
                      <TableCell>{scheme.semester.name}</TableCell>
                      <TableCell>{scheme.level}</TableCell>
                      <TableCell>
                        {scheme.assessmentTypes.map((assessmentType, i) => (
                          <p key={i}>
                            {assessmentType.name}: {assessmentType.score}%
                          </p>
                        ))}
                      </TableCell>
                      <TableCell>{formatDate(scheme.createdAt)}</TableCell>
                      <TableCell className="text-right flex flex-row items-center justify-end">
                        <Dialog
                          open={isEditGradeSchemeDialogOpen}
                          onOpenChange={setIsEditGradeSchemeDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setGradeScheme({
                                  ...scheme,
                                  department: scheme.department._id,
                                  semester: scheme.semester._id,
                                })
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Grade Scheme</DialogTitle>
                              <DialogDescription>
                                Edit assessment types and their corresponding
                                scores. The total score must equal 100.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto px-1">
                              <div className="space-y-5">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="department"
                                    className="text-sm font-medium text-gray-700"
                                  >
                                    Department
                                  </Label>
                                  <Select
                                    value={gradeScheme.department}
                                    onValueChange={(department) =>
                                      setGradeScheme({
                                        ...gradeScheme,
                                        department,
                                      })
                                    }
                                  >
                                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                      <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                      {departments.map((department) => (
                                        <SelectItem
                                          key={department._id}
                                          value={department._id}
                                        >
                                          {department.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor="level"
                                    className="text-sm font-medium text-gray-700"
                                  >
                                    Academic Level
                                  </Label>

                                  <Input
                                    id="level"
                                    placeholder="Enter Department Level"
                                    type="number"
                                    step={100}
                                    min={100}
                                    max={
                                      departments.find(
                                        (department) =>
                                          department._id ===
                                          gradeScheme.department,
                                      )?.maxLevels || 1000
                                    }
                                    value={gradeScheme.level}
                                    onChange={(e) =>
                                      setGradeScheme({
                                        ...gradeScheme,
                                        level: Number(e.target.value),
                                      })
                                    }
                                    className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor="academic-period"
                                    className="text-sm font-medium text-gray-700"
                                  >
                                    Semester
                                  </Label>
                                  <Select
                                    value={gradeScheme.semester}
                                    onValueChange={(semester) =>
                                      setGradeScheme({
                                        ...gradeScheme,
                                        semester,
                                      })
                                    }
                                  >
                                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                      <SelectValue placeholder="Select semester" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                      {semesters.map((semester) => (
                                        <SelectItem
                                          key={semester._id}
                                          value={semester._id}
                                        >
                                          {semester.name}{" "}
                                          {semester.isActive && (
                                            <span className="text-green-600 font-medium">
                                              (Active)
                                            </span>
                                          )}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-gray-700">
                                      Assessment Types
                                    </Label>
                                    <div
                                      className={cn(
                                        "flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full",
                                        isValidTotal
                                          ? "text-green-700 bg-green-100"
                                          : "text-red-700 bg-red-100",
                                      )}
                                    >
                                      {isValidTotal ? (
                                        <Check className="h-4 w-4" />
                                      ) : (
                                        <AlertCircle className="h-4 w-4" />
                                      )}
                                      Total: {totalScore}/100
                                    </div>
                                  </div>

                                  <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {gradeScheme.assessmentTypes.map(
                                      (assessment, i) => (
                                        <div
                                          key={i}
                                          className="bg-gray-50 p-3 rounded-lg border"
                                        >
                                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                            <div className="sm:col-span-7">
                                              <Label
                                                htmlFor={`assessment-${i}`}
                                                className="text-xs text-gray-600 mb-1 block"
                                              >
                                                Assessment Type
                                              </Label>
                                              <Input
                                                id={`assessment-${i}`}
                                                placeholder="e.g., Quizzes, Exams, Assignments"
                                                value={assessment.name}
                                                onChange={(e) =>
                                                  updateAssessmentType(
                                                    i,
                                                    "name",
                                                    e.target.value,
                                                  )
                                                }
                                                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                              />
                                            </div>
                                            <div className="sm:col-span-3">
                                              <Label
                                                htmlFor={`score-${i}`}
                                                className="text-xs text-gray-600 mb-1 block"
                                              >
                                                Score (%)
                                              </Label>
                                              <Input
                                                id={`score-${i}`}
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={assessment.score || ""}
                                                onChange={(e) =>
                                                  updateAssessmentType(
                                                    i,
                                                    "score",
                                                    e.target.value,
                                                  )
                                                }
                                                placeholder="0"
                                                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                              />
                                            </div>
                                            <div className="sm:col-span-2 flex items-end">
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                  removeAssessmentType(i)
                                                }
                                                disabled={
                                                  gradeScheme.assessmentTypes
                                                    .length === 1
                                                }
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      ),
                                    )}
                                  </div>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addAssessmentType}
                                    className="w-full border-dashed border-2 hover:border-blue-300 hover:bg-blue-50"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Assessment Type
                                  </Button>
                                </div>

                                {!isValidTotal && totalScore > 0 && (
                                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-700 text-center flex items-center justify-center gap-2">
                                      <AlertCircle className="h-4 w-4" />
                                      Total score must equal 100% to save the
                                      grading scheme
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <DialogFooter className="flex-shrink-0 pt-4 border-t">
                              <div className="flex flex-col justify-end sm:flex-row gap-2 w-full">
                                <DialogClose asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full sm:w-auto order-2 sm:order-1"
                                    onClick={resetForm}
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button
                                  type="submit"
                                  disabled={!canSave}
                                  onClick={() => editScheme()}
                                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 order-1 sm:order-2"
                                >
                                  Edit Scheme
                                </Button>
                              </div>
                            </DialogFooter>
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
                      No scheme found matching your filters.
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
