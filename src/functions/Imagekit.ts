export async function ImagekitAuthenticator() {
  try {
    const response = await fetch("/api/imagekit");
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    const { signature, expire, token, publicKey } = data;
    return { signature, expire, token, publicKey };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
