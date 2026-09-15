import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CompleteProfileForm from "./CompleteProfileForm";

export default async function CompleteProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");
  if (session.user.name) redirect("/landing");

  return (
    <main className="container">
      <section className="box box--primary">
        <h1>Choose your username</h1>
        <p>
          Pick a unique username to finish setting up your account.
        </p>
        <CompleteProfileForm />
      </section>
    </main>
  );
}