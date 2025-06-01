"use client";
import { Progress } from "@/components/ui/progress";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { Edit, PencilLine } from "lucide-react";
import { ComponentProps, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImagekitAuthenticator } from "@/functions/Imagekit";

export default function UploadPhoto({
  setPhotoUrl,
  onClick,
  children,
}: {
  setPhotoUrl: (url: string) => void;
  onClick: () => void;
  children?: React.ReactNode;
} & ComponentProps<typeof Button>) {
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = new AbortController();

  const handleUpload = async () => {
    try {
      const fileInput = fileInputRef.current;
      if (!fileInput || !fileInput.files || fileInput.files.length !== 1)
        throw new Error("Please select 1 file to upload");
      const file = fileInput.files[0];
      const authParams = await ImagekitAuthenticator();
      if (!authParams) throw new Error("Unable to upload");
      const { signature, expire, token, publicKey } = authParams;
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });
      if (!uploadResponse || !uploadResponse.url)
        throw new Error("Upload failed");
      setPhotoUrl(uploadResponse.url);
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        toast.error("Upload aborted:");
      } else {
        toast.error(
          (
            error as
              | Error
              | ImageKitInvalidRequestError
              | ImageKitUploadNetworkError
              | ImageKitServerError
          ).message,
        );
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleUpload}
        accept=".png,.jpg,.jpeg"
      />

      <Button
        size="icon"
        onClick={async () => {
          fileInputRef?.current?.click();
          onClick();
        }}
        className="absolute -bottom-2 -right-2 rounded-full bg-primary p-1.5 text-primary-foreground ring-2 ring-background"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <br />
      {progress > 0 && progress < 100 && (
        <Progress value={progress} max={100}></Progress>
      )}
    </>
  );
}
