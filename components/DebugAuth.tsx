"use client";

import { useState } from "react";

export default function DebugAuth() {
  const [debugResult, setDebugResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDebugTest = async () => {
    setLoading(true);
    try {
      // Test localStorage token
      const localStorageKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.includes('supabase') || key?.includes('auth')) {
          localStorageKeys.push({
            key,
            hasValue: !!localStorage.getItem(key),
            valueLength: localStorage.getItem(key)?.length || 0,
          });
        }
      }

      // Get auth headers like DemoManagement does
      const getAuthHeaders = () => {
        try {
          const authData = localStorage.getItem("sb-oyzycafkfmrrqmpwgtdg-auth-token");
          if (authData) {
            const parsed = JSON.parse(authData);
            return {
              found: true,
              hasAccessToken: !!parsed.access_token,
              tokenLength: parsed.access_token?.length || 0,
              expires: parsed.expires_at,
            };
          }
        } catch (error) {
          return { found: false, error: error.message };
        }
        return { found: false };
      };

      const authHeaders = getAuthHeaders();

      // Test API call with auth headers
      const headers = authHeaders.found && authHeaders.hasAccessToken
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("sb-oyzycafkfmrrqmpwgtdg-auth-token")).access_token}`,
          }
        : { "Content-Type": "application/json" };

      const apiResponse = await fetch("/api/debug/auth", { headers });
      const apiResult = await apiResponse.json();

      setDebugResult({
        localStorage: {
          keys: localStorageKeys,
          authToken: authHeaders,
        },
        apiTest: {
          status: apiResponse.status,
          result: apiResult,
        },
      });
    } catch (error) {
      setDebugResult({
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-medium text-yellow-800 mb-2">🔧 Debug Authentication</h3>
      <button
        onClick={runDebugTest}
        disabled={loading}
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Run Debug Test"}
      </button>

      {debugResult && (
        <div className="mt-4">
          <h4 className="font-medium text-yellow-800 mb-2">Debug Results:</h4>
          <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-96">
            {JSON.stringify(debugResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
