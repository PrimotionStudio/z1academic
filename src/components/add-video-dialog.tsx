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
import { InputVideo, Video } from "@/types/Resource";
import { Course } from "@/types/Course";
import Image from "next/image";
import IKUploadImage from "./imagekit/upload";
import { Upload } from "lucide-react";
import { getAllCourses } from "@/functions/Course";
import { toast } from "sonner";

interface AddVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVideo: (video: InputVideo) => void;
}

export function AddVideoDialog({
  open,
  onOpenChange,
  onAddVideo,
}: AddVideoDialogProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    courseId: "",
    fileLink: "",
    coverImage: "",
  });

  useEffect(() => {
    getAllCourses()
      .then((courses) => setCourses(courses))
      .catch((error) => toast.error((error as Error).message));
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCourse = courses.find(
      (course) => course._id === formData.courseId,
    );
    if (!selectedCourse) return;

    const newVideo: InputVideo = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      course: selectedCourse._id,
      fileLink: formData.fileLink,
      coverImage: formData.coverImage,
      requestedBy: null,
    };

    onAddVideo(newVideo);

    setFormData({
      title: "",
      shortDescription: "",
      courseId: "",
      fileLink: "",
      coverImage: "",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
          <DialogDescription>
            Add a new video resource to the library. Fill in all the required
            information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-title">Title *</Label>
            <Input
              id="video-title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter video title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course *</Label>
            <Select
              value={formData.courseId}
              onValueChange={(value) =>
                setFormData({ ...formData, courseId: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {courses.map((course, i) => (
                  <SelectItem key={i} value={course._id}>
                    {course.name} ({course.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-description">Short Description *</Label>
            <Textarea
              id="video-description"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              placeholder="Enter a brief description of the video"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-fileLink">Video Link *</Label>
            <Input
              id="video-fileLink"
              type="url"
              value={formData.fileLink}
              onChange={(e) =>
                setFormData({ ...formData, fileLink: e.target.value })
              }
              placeholder="https://example.com/video.mp4"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Thumbnail Image *</Label>

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
            <Button type="submit">Add Video</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
