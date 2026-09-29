"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type LogoutButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export function LogoutButton({ className = "", children }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <button data-tooltip="Logout" aria-label="logout" type="button" className={className} onClick={handleLogout}>
      {children}
    </button>
  );
}