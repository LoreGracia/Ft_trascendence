"use client";
import Link from 'next/link';
import PatternControl from "@/components/Pattern/PatternControl";
import { useState } from "react";
import Form from "@/components/Form/Form";

export default function LogIn() {
const [paused, setPaused] = useState(false);
function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    console.log(email, password);
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