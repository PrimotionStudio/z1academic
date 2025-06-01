"use client";
import { Progress } from "@/components/ui/progress";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { PencilLine } from "lucide-react";
import { ComponentProps, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function IKUploadImage({
  setFilePath,
  className,
  buttonText,
  accept,
  children,
  ...props
}: {
  setFilePath: (filePath: { fileType: string; url: string }) => void;
  className?: string;
  buttonText: string;
  accept?: string;
  children?: React.ReactNode;
} & ComponentProps<typeof Button>) {
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = new AbortController();

  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit");
      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const handleUpload = async () => {
    try {
      const fileInput = fileInputRef.current;

      if (!fileInput || !fileInput.files || fileInput.files.length !== 1)
        throw new Error("Please select 1 file to upload");

      const file = fileInput.files[0];
      const authParams = await authenticator();
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

      if (!uploadResponse || !uploadResponse.fileType || !uploadResponse.url)
        throw new Error("Upload failed");
      setFilePath({
        fileType: uploadResponse.fileType,
        url: uploadResponse.url,
      });
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
        accept={accept}
      />
      <Button
        {...props}
        onClick={async () => {
          fileInputRef?.current?.click();
        }}
      >
        {children ? (
          children
        ) : (
          <>
            {buttonText}
            <PencilLine size={5} />
          </>
        )}
      </Button>

      <br />
      {progress > 0 && progress < 100 && (
        <Progress value={progress} max={100}></Progress>
      )}
    </>
  );
}
