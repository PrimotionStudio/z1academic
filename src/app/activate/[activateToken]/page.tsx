"use client";
import { useEffect } from "react";
import Loader from "@/components/loader";
import { useParams, useRouter } from "next/navigation";
import { activateUser } from "@/functions/User";
import { toast } from "sonner";

export default function ActivatePage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (typeof params.activateToken !== "string") return;
    activateUser(params.activateToken)
      .then(() => router.push("/login"))
      .catch((error) => toast.error((error as Error).message));
  }, [params.activateToken]);
  return <Loader />;
}
