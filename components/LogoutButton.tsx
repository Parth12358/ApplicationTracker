"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white hover:bg-gray-500"
    >
      Logout
    </button>
  );
}
