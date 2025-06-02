import { InputLecturer } from "@/types/Lecturer";

export async function assignLecturer(lecturer: InputLecturer) {
  const response = await fetch("/api/lecturer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lecturer),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function getAllLecturer() {
  const response = await fetch("/api/lecturer");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.lecturers;
}
