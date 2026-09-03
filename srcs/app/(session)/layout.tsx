// import { auth } from "@/app/auth";
// import { redirect } from "next/navigation";

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//     const session = await auth();
  
//     if (session) {
//       redirect("/landing");
//     }
//   return (
//     <>
//     {children}
//     </>
//   );
// }
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/landing");
  }

  return <>{children}</>;
}