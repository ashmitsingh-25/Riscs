"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, Loader2, AlertCircle, Key, CheckCircle, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("analyst@trustnet.ai");
  const [password, setPassword] = useState("trustnet2026");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const executeSignIn = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        email: loginEmail,
        password: loginPass,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("Invalid credentials. Try using the default demo analyst credentials.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage("Authentication failed. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeSignIn(email, password);
  };

  const handleQuickDemoLogin = async () => {
    setEmail("analyst@trustnet.ai");
    setPassword("trustnet2026");
    await executeSignIn("analyst@trustnet.ai", "trustnet2026");
  };

  return (
    <Card className="w-full max-w-md rounded-4xl border border-black/[0.08] bg-white/95 p-3 shadow-apple-float backdrop-blur-2xl">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#1d1d1f] text-white shadow-md">
          <Shield className="h-7 w-7 text-white" />
        </div>
        <CardTitle className="mt-4 text-2xl font-bold tracking-tight text-[#1d1d1f]">
          Security Verification Sign In
        </CardTitle>
        <CardDescription className="text-xs text-[#86868b] max-w-xs mx-auto">
          Please sign in to access TrustNet&apos;s real-time multi-modal forensic inspection engines and SOC dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Demo One-Click Access Button */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0071e3]/10 via-[#0071e3]/5 to-transparent border border-[#0071e3]/20 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0071e3]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Instant Demo Access</span>
            </div>
            <span className="text-[10px] bg-[#0071e3] text-white px-2 py-0.5 rounded-full font-medium">Pre-configured</span>
          </div>
          <p className="text-[11px] text-[#424245] leading-relaxed">
            One-click bypass to enter the security console immediately with full analyst privileges.
          </p>
          <Button
            type="button"
            variant="default"
            disabled={loading}
            onClick={handleQuickDemoLogin}
            className="w-full h-11 rounded-full text-xs font-bold bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Signing in as Demo Analyst...
              </>
            ) : (
              <>
                <Key className="h-3.5 w-3.5" />
                One-Click Sign In (analyst@trustnet.ai)
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </>
            )}
          </Button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-black/[0.08]"></div>
          <span className="flex-shrink mx-3 text-[11px] font-medium text-[#86868b] uppercase tracking-wider">
            or enter credentials
          </span>
          <div className="flex-grow border-t border-black/[0.08]"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
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
                className="pl-10 h-11 rounded-2xl"
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
                className="pl-10 h-11 rounded-2xl"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-xl bg-[#ff453a]/10 border border-[#ff453a]/20 p-2.5 text-xs font-medium text-[#ff453a] flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            variant="secondary"
            className="w-full h-11 rounded-full font-semibold mt-2 border border-black/[0.08] hover:bg-black/5"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Sign In With Credentials
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-8 text-xs text-[#86868b]">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading authentication portal...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
