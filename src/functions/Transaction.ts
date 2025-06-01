export async function getAllTransaction() {
  const response = await fetch("/api/transaction");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.transactions;
}

export async function getOneTransaction(transactionId: string) {
  const response = await fetch(
    `/api/transaction?transactionId=${transactionId}`,
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.transaction;
}
