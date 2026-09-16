"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { GoogleIcon } from "./GoogleIcon";

export function GoogleButton() {
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/complete-profile",
      });
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogle}
      disabled={loading}
      className="button button-squere bg-(--black) text-(--white) hover:bg-(--light) disable:hover-none disabled:bg-(--light)"
    >
      <GoogleIcon size={18} />
      <span>{loading ? "Redirecting…" : "Continue with Google"}</span>
    </button>
  );
}