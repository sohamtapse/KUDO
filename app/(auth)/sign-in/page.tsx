"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/sign-in", { email, password });
      setMessage(res.data.message);
      router.push("/dashboard");
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setMessage(axiosErr.response?.data?.message || "Error signing in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  text-white px-6">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl px-8 py-10 space-y-6 transition-transform hover:scale-[1.01]"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Sign In</h1>
            <p className="text-gray-400 text-sm">Welcome back to KUDO</p>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all cursor-pointer"
          >
            Sign In →
          </button>

          {/* Link */}
          <p className="text-center text-gray-400 text-sm">
            Don not have an account?{" "}
            <a
              href="/sign-up"
              className="text-purple-400 hover:text-purple-500 font-medium"
            >
              Sign up
            </a>
          </p>

          {/* Message */}
          {message && (
            <p className="text-center mt-3 text-sm text-gray-300">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
