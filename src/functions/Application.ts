import { InputApplicationData } from "@/types/Application";

export function validatePersonalInfoForm(
  applicationData: InputApplicationData,
) {
  if (!applicationData.program) throw new Error("Program is required");
  if (!applicationData.dateOfBirth)
    throw new Error("Date of birth is required");
  if (!applicationData.stateOfOrigin)
    throw new Error("State of origin is required");
  if (!applicationData.lga) throw new Error("LGA is required");
  if (!applicationData.contactAddress)
    throw new Error("Contact address is required");
  if (!applicationData.nextOfKin) throw new Error("Next of kin is required");
  if (!applicationData.nextOfKinPhone)
    throw new Error("Next of kin phone is required");
  else if (!/^\d{11}$/.test(applicationData.nextOfKinPhone))
    throw new Error("Phone number must be 11 digits");

  return true;
}

export function validateEducationalInfoForm(
  applicationData: InputApplicationData,
) {
  if (!applicationData.examType)
    throw new Error("Examination type is required");
  if (!applicationData.examNumber)
    throw new Error("Examination number is required");
  if (!applicationData.examYear)
    throw new Error("Examination year is required");

  let validSubjectsCount = 0;
  applicationData.subjects.forEach((subject) => {
    if (subject.subject && subject.grade) {
      validSubjectsCount++;
    }
  });

  if (validSubjectsCount < 1)
    throw new Error("At least 1 subjects with grades are required");

  if (!applicationData.resultFile.url || !applicationData.resultFile.fileType)
    throw new Error("Upload some results files, documents or certificates");

  return true;
}

export async function createNewApplication(
  applicationData: InputApplicationData,
) {
  const amount = 15000;
  const transactionResponse = await fetch("/api/transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
  const transactionData = await transactionResponse.json();
  if (!transactionResponse.ok) throw new Error("Cannot complete payment");

  const applicationResponse = await fetch("/api/application", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...applicationData,
      transaction: transactionData.transaction._id,
      amount,
    }),
  });
  const aData = await applicationResponse.json();
  if (!applicationResponse.ok) throw new Error(aData.message);

  return {
    message: aData.message,
    transaction: transactionData.transaction._id,
    amount,
  };
}

export async function getAllApplication() {
  const response = await fetch("/api/application");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.applications;
}

export async function getOneApplication(applicationId: string) {
  const response = await fetch(
    `/api/application?applicationId=${applicationId}`,
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.application;
}

export async function reviewApplication(
  applicationId: string,
  status: "Pending" | "Accepted" | "Rejected",
) {
  const response = await fetch("/api/application", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicationId, status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}
