"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { GithubIcon } from "./GithubIcon";

export function GithubButton() {
  const [loading, setLoading] = useState(false);

  async function handleGithub() {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/complete-profile",
      });
    } catch (err) {
      console.error("Github sign-in failed:", err);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGithub}
      disabled={loading}
      className="button button-squere bg-(--black) text-(--white) hover:bg-(--light) disable:hover-none disabled:bg-(--light)"
    >
      <GithubIcon size={18} />
      <span>{loading ? "Redirecting…" : "Continue with Github"}</span>
    </button>
  );
}