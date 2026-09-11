// app/patient/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  Lock,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { normalizePhone, phoneToEmail } from "@/lib/patient-auth";

export default function PatientLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: patientRow } = await supabase
            .from("patients")
            .select("id")
            .eq("user_id", session.user.id)
            .maybeSingle();

          if (patientRow) {
            router.replace("/patient/dashboard");
            return;
          }
        }
      } finally {
        setChecking(false);
      }
    })();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleaned = normalizePhone(phone);
    if (cleaned.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const email = phoneToEmail(cleaned);
      const password = cleaned;

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data?.user) {
        setError(
          "Invalid mobile number. Please use the same number you used while booking an appointment."
        );
        setLoading(false);
        return;
      }

      const { data: patientRow } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!patientRow) {
        setError("No patient record found for this number.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      router.replace("/patient/dashboard");
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-[#1a9fa8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7f8] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-[#1a9fa8] px-6 py-8 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mb-3">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-white text-xl font-bold">Patient Login</h1>
            <p className="text-white/85 text-[13px] mt-1">
              Access your appointments & reports
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-5">
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-[13px]">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">
                Mobile Number
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus-within:border-[#1a9fa8] focus-within:ring-2 focus-within:ring-[#1a9fa8]/20">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-[13px] text-gray-500 pr-2 border-r border-gray-200">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={15}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="flex-1 text-[14px] outline-none bg-transparent"
                  required
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5">
                Use the same number you provided while booking your appointment.
              </p>
            </div>

            <div className="flex items-start gap-2 bg-[#f0faf9] border border-[#cbecee] text-[#1a7a90] px-3 py-2.5 rounded-lg text-[12px]">
              <Lock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>
                Your password is your mobile number itself. You&apos;ll be able to
                change it after logging in.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#1a9fa8] hover:bg-[#158089] text-white text-[14px] font-semibold disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center pt-2">
              <p className="text-[12px] text-gray-500">
                Don&apos;t have an appointment yet?{" "}
                <a
                  href="/book-appointment"
                  className="text-[#1a9fa8] font-semibold hover:underline"
                >
                  Book one now
                </a>
              </p>
            </div>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-6">
          © {new Date().getFullYear()} Sant Haridas Hospital
        </p>
      </div>
    </div>
  );
}