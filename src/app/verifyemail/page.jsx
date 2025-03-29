"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error) {
      setError(true);
      console.log(error.response?.data || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-center">Verify Email</h1>

        {loading && (
          <div className="text-center">
            <p className="text-lg">Verifying your email...</p>
            <div className="mt-4 flex justify-center">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {!loading && verified && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-500 mb-4">
              Email Verified Successfully!
            </h2>
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Go to Login
            </Link>
          </div>
        )}

        {!loading && error && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-500 mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-400 mb-4">
              The token is invalid or has expired. Please try again.
            </p>
            <Link
              href="/signup"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Go to Signup
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}