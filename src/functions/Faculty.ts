export async function addNewFaculty(facultyName: string) {
  const response = await fetch("/api/faculty", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: facultyName }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function getAllFaculties() {
  const response = await fetch("/api/faculty");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.faculties;
}

export async function editFaculty(facultyId: string, facultyName: string) {
  const response = await fetch("/api/faculty", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ facultyId, name: facultyName }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}
