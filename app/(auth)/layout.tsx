"use client";

import { useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    axios
      .get("/api/me")
      .then(() => {
        router.push("/dashboard");
      })
      .catch(() => setChecking(false));

    if (status === "authenticated") {
      router.replace("/dashboard");
      return;
    }

    if (status === "loading") return;
  }, [status, router]);

  if (checking) {
    return (
      <div className="dark text-white h-screen flex justify-center items-center">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}
