"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      await axios.post("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message || "Logout failed");
    }
  };

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users/profile");
      console.log(res.data);
      setData(res.data.user);
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
        <hr className="mb-4 border-gray-600" />

        <div className="text-center">
          <p className="text-lg mb-4">Welcome to your profile page!</p>
          {data ? (
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-green-500 mb-2">
                User ID:{" "}
                <Link
                  href={`/profile/${data._id}`}
                  className="text-blue-400 hover:underline"
                >
                  {data._id}
                </Link>
              </h2>
              <p className="text-gray-400">Email: {data.email}</p>
              <p className="text-gray-400">Username: {data.username}</p>
            </div>
          ) : (
            <p className="text-gray-400 mb-4">
              {loading ? "Loading user details..." : "No user details available"}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={getUserDetails}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
          >
            {loading ? "Fetching Details..." : "Get User Details"}
          </button>
          <button
            onClick={logout}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}