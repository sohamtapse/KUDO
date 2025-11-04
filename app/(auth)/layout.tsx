"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/me")
      .then(() => {
        router.push("/dashboard");
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div className="dark text-white h-screen flex justify-center items-center">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}
