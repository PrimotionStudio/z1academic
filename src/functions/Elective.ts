import { InputElective } from "@/types/Elective";

export async function addElective(elective: InputElective) {
  const response = await fetch("/api/elective", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(elective),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function getAllElectives() {
  const response = await fetch("/api/elective");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.electives;
}

export async function editElective(
  electiveId: string,
  elective: InputElective,
) {
  const response = await fetch("/api/elective", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ electiveId, elective }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}
