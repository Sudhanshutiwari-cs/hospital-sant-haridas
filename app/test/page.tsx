// app/test-connection/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function TestConnection() {
  const [status, setStatus] = useState("Testing...");
  const [error, setError] = useState("");

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test if Supabase URL is configured
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!url || !key) {
        setStatus("❌ Missing environment variables");
        setError("Check .env.local file for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
        return;
      }

      // Test simple query
      const { data, error } = await supabase
        .from('doctors')
        .select('count', { count: 'exact', head: true });

      if (error) {
        setStatus("❌ Database query failed");
        setError(error.message);
        return;
      }

      setStatus("✅ Connected successfully");
    } catch (err: any) {
      setStatus("❌ Connection failed");
      setError(err.message || "Unknown error");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-lg mb-2">{status}</p>
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="mt-4 text-sm">
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</p>
          <p>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}</p>
        </div>
      </div>
    </div>
  );
}