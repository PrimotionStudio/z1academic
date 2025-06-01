import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
      <Button size={"lg"} asChild>
        <Link href={"/login"}>Login</Link>
      </Button>
      <Button variant={"outline"} size={"lg"} asChild>
        <Link href={"/register"}>Register</Link>
      </Button>
    </div>
  );
}
