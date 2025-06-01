"use client";
import { IKImage as Image } from "imagekitio-next";

const ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URI_ENDPOINT;

export default function IKImage({
  path,
  width,
  height,
  alt,
  className,
  transformation,
  style,
  loading,
}: {
  path: string;
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
  transformation: any;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager" | "auto";
}) {
  if (!path || !alt || !width || !height) return null;
  return (
    <Image
      path={path}
      width={width}
      height={height}
      alt={alt}
      className={className}
      transformation={transformation}
      style={style}
      loading={loading && loading !== "auto" ? loading : "eager"}
      urlEndpoint={ENDPOINT}
    />
  );
}
