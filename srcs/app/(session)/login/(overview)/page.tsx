"use client";
import Link from 'next/link';
import PatternControl from "@/components/Pattern/PatternControl";
import { useState } from "react";
import Form from "@/components/Form/Form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogIn() {
const router = useRouter();
const [paused, setPaused] = useState(false);
async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    console.log("Formulario enviado");
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const { error } = await authClient.signIn.email(
      {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
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
        href={'/signin'}
        target="_self"
        rel="noopener noreferrer"
        >
            Sign in
        </Link>
        <div className="container">
            <section className="box box--primary">
                <Form onSubmit={handleLogin}>
                <button type="submit" className="button button-squere button--basic mt-5">
                    Login
                </button>
                </Form>
                <h2 className="underline">Forgot password</h2>
            </section>
        </div>
    </main>
    </>
  )
}