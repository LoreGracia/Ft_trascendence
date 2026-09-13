"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

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
		className="button button-squere button--basic mt-5"
	>
		{loading ? "Redirecting…" : "Continue with Google"}
	</button>
  );
}