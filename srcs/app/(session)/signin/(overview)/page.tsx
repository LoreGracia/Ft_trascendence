"use client";
import Link from 'next/link';
import PatternControl from "@/components/Pattern/PatternControl";
import { useState } from "react";
import Form from "@/components/Form/Form";

export default function SignIn() {
const [paused, setPaused] = useState(false);
function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    console.log(email, password);
}
  return (
    <>
    <div className={`pattern ${paused ? "paused" : ""}`}  />
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