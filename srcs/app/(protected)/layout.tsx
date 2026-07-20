import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/button/LogoutButton";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

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
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <LogoutButton/>
        <SidebarInset>
        {children}
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}