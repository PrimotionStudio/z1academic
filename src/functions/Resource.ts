import { InputBook, InputVideo } from "@/types/Resource";

export async function addNewBook(book: InputBook) {
  const response = await fetch("/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.book;
}

export async function getAllBooks() {
  const response = await fetch("/api/book");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.books;
}

export async function getAllUnpublishedBooks() {
  const response = await fetch("/api/book/unpublished");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.books;
}

export async function approveBook(bookId: string) {
  const response = await fetch("/api/book", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bookId,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.book;
}

export async function deleteBook(bookId: string) {
  const response = await fetch("/api/book", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bookId,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.book;
}

export async function addNewVideo(video: InputVideo) {
  const response = await fetch("/api/video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(video),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.video;
}

export async function getAllVideos() {
  const response = await fetch("/api/video");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.videos;
}

export async function getAllUnpublishedVideos() {
  const response = await fetch("/api/video/unpublished");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.videos;
}

export async function approveVideo(videoId: string) {
  const response = await fetch("/api/video", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      videoId,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.video;
}

export async function deleteVideo(videoId: string) {
  const response = await fetch("/api/video", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      videoId,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.video;
}
