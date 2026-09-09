"use client";
import Link from 'next/link';
import PatternControl from "@/components/Pattern/PatternControl";
import { useState } from "react";
import Form from "@/components/Form/Form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignIn() {
const router = useRouter();
const [paused, setPaused] = useState(false);
async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const { error } = await authClient.signUp.email(
      {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        name: formData.get("name") as string,
        //username: formData.get("username") as string, // see note below
      },
      {
        onSuccess: () => router.push("/landing"),
        onError: (ctx) => console.error(ctx.error.message),
      }
    );

}
  return (
    <>
    <PatternControl
        paused={paused}
        onToggle={() => setPaused(!paused)}
    />
    <main className="container">
        <Link
        className="corner-right button button-squere button--highlight"
        href={'/login'}
        target="_self"
        rel="noopener noreferrer"
        >
            Log in
        </Link>
        <div className="container">
            <section className="box box--primary">
                <Form onSubmit={handleRegister}>
                <button type="submit" className="button button-squere button--basic mt-5">
                    <h2>Sign in</h2>
                </button>
                </Form>
            </section>
        </div>
    </main>
    </>
  )
}