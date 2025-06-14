import { InputTimetable } from "@/types/Timetable";

export async function setTimeTable(timetable: InputTimetable) {
  const response = await fetch("/api/timetable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(timetable),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function getAllTimetables() {
  const response = await fetch("/api/timetable");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.timetables;
}

export async function getOneTimetables(timetableId: string) {
  const response = await fetch(`/api/timetable?timetableId=${timetableId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.timetable;
}

export async function getTimetable(
  departmentId: string,
  level: string,
  semesterId: string,
) {
  const response = await fetch(
    `/api/timetable?departmentId=${departmentId}&level=${level}&semesterId=${semesterId}`,
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.timetable;
}
