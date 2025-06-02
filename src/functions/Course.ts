import { InputCourse } from "@/types/Course";

export async function addNewCourse(course: InputCourse) {
  const response = await fetch("/api/course", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function getAllCourses() {
  const response = await fetch("/api/course");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.courses;
}

export async function editCourse(courseId: string, course: InputCourse) {
  const response = await fetch("/api/course", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...course, courseId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}
