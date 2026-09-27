"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, Loader2, AlertCircle, Key } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("analyst@trustnet.ai");
  const [password, setPassword] = useState("trustnet2026");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("Invalid credentials. Try the default analyst demo credentials.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage("Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-4xl border border-black/[0.08] bg-white/95 p-2 shadow-apple-float backdrop-blur-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#1d1d1f] text-white shadow-md">
            <Shield className="h-7 w-7" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold tracking-tight text-[#1d1d1f]">
            Analyst Sign In
          </CardTitle>
          <CardDescription className="text-xs text-[#86868b]">
            Authenticate to access zero-retention logs and administrative SOC tools.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Demo Sandbox Alert */}
          <div className="rounded-2xl bg-[#0071e3]/5 border border-[#0071e3]/15 p-3.5 text-xs text-[#0071e3] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <Key className="h-3.5 w-3.5" />
              <span>Demo Sandbox Credentials:</span>
            </div>
            <p className="font-mono text-[11px] text-[#424245]">
              Email: <strong>analyst@trustnet.ai</strong> <br />
              Password: <strong>trustnet2026</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#1d1d1f]">
                Work Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#86868b]" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="analyst@trustnet.ai"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1d1d1f]">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#86868b]" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs font-semibold text-[#ff453a] flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full font-semibold mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Enter Security Console
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
