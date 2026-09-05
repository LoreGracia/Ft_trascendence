// import { logout } from "@/actions/auth";

// type LogoutButtonProps = {
//   className?: string;
//   children: React.ReactNode;
// };

// export function LogoutButton({
//   className = "",
//   children,
// }: LogoutButtonProps) {
//   return (
//     <form action={logout} className={className}>
//       <button type="submit">
//         {children}
//       </button>
//     </form>
//   );
// }
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
    <button type="button" className={className} onClick={handleLogout}>
      {children}
    </button>
  );
}