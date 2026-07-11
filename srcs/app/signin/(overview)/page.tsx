"use client";
import Link from 'next/link';
import PatternControl from "@/components/Pattern/PatternControl";
import { useState } from "react";
import Form from "@/components/Form/Form";

export default function SignIn() {
const [paused, setPaused] = useState(false);
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
                <Form />
                <div className="button button-squere bg-(--black) text-(--white) w-fill">
                    <h2>Sign in</h2>
                </div>
            </section>
        </div>
    </main>
    </>
  )
}