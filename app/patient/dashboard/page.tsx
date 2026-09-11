// app/patient/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  Calendar,
  User as UserIcon,
  LogOut,
  FileText,
  Stethoscope,
  RefreshCw,
  ChevronDown,
  Phone,
} from "lucide-react";
import { supabase } from "@/lib/supabase-client";

type PatientRow = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  date_of_birth: string | null;
  blood_group: string | null;
};

type AppointmentRow = {
  id: string;
  appointment_number: string | null;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string | null;
  status: string | null;
  symptoms: string | null;
  notes: string | null;
  diagnosis: string | null;
  prescription: string | null;
  payment_status: string | null;
  payment_amount: number | null;
  payment_method: string | null;
  created_at: string;
  doctor: {
    id: string;
    full_name: string;
    specialization: string | null;
    profile_image_url: string | null;
    degree: string | null;
  } | null;
};

function StatusBadge({ status }: { status: string | null }) {
  const s = (status || "pending").toLowerCase();
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    confirmed: "bg-sky-100 text-sky-800 border-sky-200",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    no_show: "bg-gray-200 text-gray-700 border-gray-300",
  };
  const cls = map[s] || "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}
    >
      {s.replace("_", " ")}
    </span>
  );
}

function PayBadge({ status }: { status: string | null }) {
  const s = (status || "unpaid").toLowerCase();
  const cls =
    s === "paid"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : s === "refunded"
      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
      : "bg-rose-50 text-rose-700 border-rose-200";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}
    >
      {s}
    </span>
  );
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function fmtTime(t: string | null) {
  if (!t) return "—";
  return t.slice(0, 5);
}

export default function PatientDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<PatientRow | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/patient/login");
        return;
      }

      const { data: patientRow, error: patientErr } = await supabase
        .from("patients")
        .select("id, full_name, email, phone, gender, date_of_birth, blood_group")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (patientErr || !patientRow) {
        setError("Patient profile not found. Please contact the hospital.");
        setLoading(false);
        return;
      }

      setPatient(patientRow as PatientRow);

      const { data: apptData, error: apptErr } = await supabase
        .from("appointments")
        .select(
          `
          id,
          appointment_number,
          appointment_date,
          appointment_time,
          appointment_type,
          status,
          symptoms,
          notes,
          diagnosis,
          prescription,
          payment_status,
          payment_amount,
          payment_method,
          created_at,
          doctor:doctors (
            id,
            full_name,
            specialization,
            profile_image_url,
            degree
          )
        `
        )
        .eq("patient_id", patientRow.id)
        .order("appointment_date", { ascending: false })
        .order("appointment_time", { ascending: false });

      if (apptErr) {
        setError(apptErr.message);
        setLoading(false);
        return;
      }

      setAppointments((apptData ?? []) as unknown as AppointmentRow[]);
    } catch (e: any) {
      setError(e?.message || "Failed to load your appointments.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter((a) => {
        const d = new Date(`${a.appointment_date}T${a.appointment_time}`);
        return (
          d >= new Date() &&
          (a.status === "pending" || a.status === "confirmed")
        );
      })
      .sort(
        (a, b) =>
          new Date(`${a.appointment_date}T${a.appointment_time}`).getTime() -
          new Date(`${b.appointment_date}T${b.appointment_time}`).getTime()
      );
  }, [appointments]);

  const pastAppointments = useMemo(() => {
    return appointments.filter(
      (a) => !upcomingAppointments.find((u) => u.id === a.id)
    );
  }, [appointments, upcomingAppointments]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = upcomingAppointments.length;
    const completed = appointments.filter((a) => a.status === "completed")
      .length;
    const cancelled = appointments.filter((a) => a.status === "cancelled")
      .length;
    return { total, upcoming, completed, cancelled };
  }, [appointments, upcomingAppointments]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/patient/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-[#1a9fa8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a9fa8]/10 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-[#1a9fa8]" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#1a3a5c]">
                {patient?.full_name || "Patient"}
              </p>
              <p className="text-[12px] text-gray-500 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {patient?.phone ? `+91 ${patient.phone}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRefreshing(true);
                load(true);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-[13px] font-semibold text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-[13px] font-semibold text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-6">
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-[13px] mb-5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, color: "text-[#1a3a5c]" },
            { label: "Upcoming", value: stats.upcoming, color: "text-sky-600" },
            {
              label: "Completed",
              value: stats.completed,
              color: "text-emerald-600",
            },
            {
              label: "Cancelled",
              value: stats.cancelled,
              color: "text-red-600",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3"
            >
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                {s.label}
              </p>
              <p className={`text-[22px] font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <section className="mb-8">
          <h2 className="text-[16px] font-bold text-[#1a3a5c] mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#1a9fa8]" />
            Upcoming Appointments
          </h2>
          {upcomingAppointments.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-[13px] text-gray-500 mb-4">
                You have no upcoming appointments.
              </p>
              <Link
                href="/book-appointment"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a9fa8] hover:bg-[#158089] text-white text-[13px] font-semibold"
              >
                Book an appointment
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.map((a) => (
                <AppointmentCard key={a.id} appt={a} highlight />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-[16px] font-bold text-[#1a3a5c] mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#1a9fa8]" />
            Appointment History
          </h2>
          {pastAppointments.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-[13px] text-gray-500">No past appointments.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastAppointments.map((a) => (
                <AppointmentCard key={a.id} appt={a} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function AppointmentCard({
  appt,
  highlight = false,
}: {
  appt: AppointmentRow;
  highlight?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden ${
        highlight ? "border-[#1a9fa8]/40 shadow-sm" : "border-gray-200"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
            {appt.doctor?.profile_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={appt.doctor.profile_image_url}
                alt={appt.doctor.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-[#1a3a5c] truncate">
                  {appt.doctor?.full_name || "Doctor"}
                </p>
                <p className="text-[12px] text-gray-500 truncate">
                  {appt.doctor?.specialization || "General Consultation"}
                  {appt.doctor?.degree ? ` • ${appt.doctor.degree}` : ""}
                </p>
              </div>
              <StatusBadge status={appt.status} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[12px] text-gray-600">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#1a9fa8]" />
                {fmtDate(appt.appointment_date)}
              </span>
              <span>{fmtTime(appt.appointment_time)}</span>
              {appt.appointment_number && (
                <span className="text-gray-400">#{appt.appointment_number}</span>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <PayBadge status={appt.payment_status} />
                {appt.payment_amount != null && (
                  <span className="text-[12px] text-gray-600 font-medium">
                    ₹{appt.payment_amount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen((o) => !o)}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1a9fa8] hover:underline"
              >
                {open ? "Hide details" : "View details"}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 text-[12.5px]">
            <Detail label="Symptoms" value={appt.symptoms} />
            <Detail label="Doctor Notes" value={appt.notes} />
            <Detail label="Diagnosis" value={appt.diagnosis} />
            <Detail label="Prescription" value={appt.prescription} />
            <Detail
              label="Type"
              value={appt.appointment_type?.replace("_", " ") || null}
            />
            <Detail
              label="Payment method"
              value={appt.payment_method || null}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-[10.5px] font-bold uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </p>
      <p className="text-gray-800 whitespace-pre-wrap">
        {value?.trim() ? value : <span className="text-gray-400">—</span>}
      </p>
    </div>
  );
}