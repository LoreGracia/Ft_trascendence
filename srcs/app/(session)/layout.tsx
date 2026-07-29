import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await auth();
  
    if (session) {
      redirect("/game-selection");
    }
  return (
    <>
    {children}
    </>
  );
}
