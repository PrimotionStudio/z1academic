import { InputDepartment } from "@/types/Department";

export async function addNewDepartment(department: InputDepartment) {
  const response = await fetch("/api/department", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(department),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function getAllDepartments() {
  const response = await fetch("/api/department");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.departments;
}

export async function editDepartment(
  department: InputDepartment & { departmentId: string },
) {
  const response = await fetch("/api/department", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(department),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}
