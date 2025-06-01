import { InputFee } from "@/types/Fee";

export async function addNewFee(fee: InputFee) {
  const response = await fetch("/api/fee", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fee),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function getAllFee() {
  const response = await fetch("/api/fee");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.fees;
}

export async function editFee(feeId: string, fee: InputFee) {
  const response = await fetch("/api/fee", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...fee, feeId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}
