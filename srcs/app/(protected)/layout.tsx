import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/button/LogoutButton";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
  <>
    <LogoutButton/>
    {children}
  </>
  );
}