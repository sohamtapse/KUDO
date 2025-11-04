"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/me")
      .then(() => setLoading(false))
      .catch(() => {
        router.push("/sign-in");
      });
  }, [router]);

  if (loading) {
    return (
      <div className="dark text-white h-170 flex justify-center items-center">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}
