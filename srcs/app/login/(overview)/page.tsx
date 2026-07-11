"use client";
import Link from 'next/link';
import PatternControl from "@/components/Pattern/PatternControl";
import { useState } from "react";
import Form from "@/components/Form/Form";

export default function LogIn() {
const [paused, setPaused] = useState(false);
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
                <Form />
                <div className="button button-squere bg-(--black) text-(--white) w-fill">
                    <h2>Log in</h2>
                </div>
                <h2 className="underline">Forgot password</h2>
            </section>
        </div>
    </main>
    </>
  )
}