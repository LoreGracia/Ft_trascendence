"use client";
import TextInput from "@/components/Input/Input";
import Link from 'next/link';
import { Button } from "@/components/button/Button";
import { useState } from "react";

export default function LogIn() {
const [paused, setPaused] = useState(false);
  return (
    <>
    <div className={`pattern ${paused ? "paused" : ""}`}  />
    <button
        onClick={() => setPaused(!paused)}
        className="corner-left button button-round button--secondary">
    {paused ? "Reanudar" : "Pausar"}
    </button>
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
                    <h2>Log in</h2>
                </div>
                <h2 className="underline">Forgot password</h2>
            </section>
        </div>
    </main>
    </>
  )
}