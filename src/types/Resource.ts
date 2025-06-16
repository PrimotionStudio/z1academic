import { Course } from "./Course";
import { Department } from "./Department";
import { User } from "./User";

export interface Book {
  _id: string;
  title: string;
  shortDescription: string;
  author: string;
  department: Department;
  fileLink: string;
  coverImage: string;
  publishedStatus: "unpublished" | "published";
  requestedBy: User | null;
  createdAt: Date;
}

export interface Video {
  _id: string;
  title: string;
  shortDescription: string;
  course: Course;
  fileLink: string;
  coverImage: string;
  publishedStatus: "unpublished" | "published";
  requestedBy: User | null;
  createdAt: Date;
}

export interface InputBook {
  title: string;
  shortDescription: string;
  author: string;
  department: string;
  fileLink: string;
  coverImage: string;
  requestedBy: string | null;
}

export interface InputVideo {
  title: string;
  shortDescription: string;
  course: string;
  fileLink: string;
  coverImage: string;
  requestedBy: string | null;
}
