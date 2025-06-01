export async function addNewPeriod(periodName: string) {
  const response = await fetch("/api/period", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ periodName }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function getAllPeriods() {
  const response = await fetch("/api/period");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.periods;
}

export async function editPeriod(periodId: string, periodName: string) {
  const response = await fetch("/api/period", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ periodId, periodName }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function activatePeriod(periodId: string) {
  const response = await fetch("/api/period/activate", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ periodId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}
