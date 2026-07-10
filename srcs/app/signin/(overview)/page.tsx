"use client";
import TextInput from "@/components/Input/Input";
import Link from 'next/link';
import { Button } from "@/components/button/Button";
import { useState } from "react";

export default function SignIn() {
    const [paused, setPaused] = useState(false);
  return (
    <>
    <div className='pattern  ${paused ? "paused" : ""}' />
    <main className="container">
        <button onClick={() => setPaused(!paused)}>
        {paused ? "Reanudar" : "Pausar"}
        </button>
        <Link
        className="corner button button-squere button--highlight"
        href={'/login'}
        target="_self"
        rel="noopener noreferrer"
        >
            Log in
        </Link>
        <div className="container">
            <section className="box box--primary">
                <div>
                    <h2>Email</h2>
                    <TextInput
                    type="text"
                    name="email"
                    placeholder="value@gmail.com"
                    />
                </div>
                <div>
                    <h2>Password</h2>
                    <TextInput
                    type="text"
                    name="password"
                    placeholder="Insert password"
                    />
                </div>
                <div className="button button-squere bg-(--black) text-(--white) w-fill">
                    <h2>Sign in</h2>
                </div>
            </section>
        </div>
    </main>
    </>
  )
}