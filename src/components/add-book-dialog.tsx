"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, InputBook } from "@/types/Resource";
import { Department } from "@/types/Department";
import UploadPhoto from "./imagekit/uploadPhoto";
import IKUploadImage from "./imagekit/upload";
import { Upload } from "lucide-react";
import Image from "next/image";
import { getAllDepartments } from "@/functions/Department";
import { toast } from "sonner";

interface AddBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBook: (book: InputBook) => void;
}

export function AddBookDialog({
  open,
  onOpenChange,
  onAddBook,
}: AddBookDialogProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    author: "",
    departmentId: "",
    fileLink: "",
    coverImage: "",
  });
  useEffect(() => {
    getAllDepartments()
      .then((departments) => setDepartments(departments))
      .catch((error) => toast.error((error as Error).message));
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDepartment = departments.find(
      (dept) => dept._id === formData.departmentId,
    );
    if (!selectedDepartment) return;

    const newBook: InputBook = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      author: formData.author,
      department: selectedDepartment._id,
      fileLink: formData.fileLink,
      coverImage: formData.coverImage,
      requestedBy: null,
    };

    onAddBook(newBook);

    // Reset form
    setFormData({
      title: "",
      shortDescription: "",
      author: "",
      departmentId: "",
      fileLink: "",
      coverImage: "",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Add a new book resource to the library. Fill in all the required
            information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.departmentId}
              onValueChange={(value) =>
                setFormData({ ...formData, departmentId: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept, i) => (
                  <SelectItem key={i} value={dept._id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              placeholder="Enter a brief description of the book"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileLink">File Link *</Label>
            <Input
              id="fileLink"
              type="url"
              value={formData.fileLink}
              onChange={(e) =>
                setFormData({ ...formData, fileLink: e.target.value })
              }
              placeholder="https://example.com/book.pdf"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image *</Label>

            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-muted/50">
              {formData.coverImage ? (
                <div className="w-full">
                  <Image
                    src={formData.coverImage}
                    alt={formData.coverImage}
                    width={160}
                    height={160}
                    className="max-h-40 mx-auto object-contain mb-2"
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setFormData({ ...formData, coverImage: "" })}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">IMAGES</p>
                  <Label className="mt-2 cursor-pointer">
                    <IKUploadImage
                      variant="outline"
                      size="sm"
                      type="button"
                      accept="image/*"
                      buttonText="Select File"
                      setFilePath={(file) => {
                        setFormData({ ...formData, coverImage: file.url });
                      }}
                    />
                  </Label>
                </>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Book</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
