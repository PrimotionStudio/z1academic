export async function addNewSession(sessionName: string) {
  const response = await fetch("/api/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionName }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function getAllSessions() {
  const response = await fetch("/api/session");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.sessions;
}

export async function editSession(sessionId: string, sessionName: string) {
  const response = await fetch("/api/session", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, sessionName }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function activateSession(sessionId: string) {
  const response = await fetch("/api/session/activate", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}
