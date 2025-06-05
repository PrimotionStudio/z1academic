import { InputGradeScheme } from "@/types/GradeScheme";

export async function addNewGradeScheme(scheme: InputGradeScheme) {
  const response = await fetch("/api/grade-scheme", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scheme),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function getAllGradeSchemes() {
  const response = await fetch("/api/grade-scheme");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.gradeSchemes;
}

export async function editGradeScheme(scheme: InputGradeScheme) {
  const response = await fetch("/api/grade-scheme", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...scheme }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}
