"use client";
import Link from 'next/link';
import PatternControl from "@/components/Pattern/PatternControl";
import { useState, useTransition } from "react";
import Form from "@/components/Form/Form";
import { signupSchema } from "@/lib/validation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import TextInput from '@/components/Input/Input';
import { GoogleButton } from "@/components/button/GoogleButton";

export default function SignUp() {
  const router = useRouter();
  const [paused, setPaused] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function clearError(field: string) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = signupSchema.safeParse(rawData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    
    startTransition(async () => {
      const { error } = await authClient.signUp.email(result.data, {
        onSuccess: () => router.push("/landing"),
      });

      if (error) {
        if (error.code === "USERNAME_TAKEN") {
          setErrors({ name: error.message });
        } else if (error.code === "EMAIL_TAKEN") {
          setErrors({ email: error.message });
        } else {
          setErrors({ email: error.message ?? "Could not create account" });
        }
      }
    });
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
            href={'/login'}
            target="_self"
            rel="noopener noreferrer"
          >
            Log in
          </Link>
          <div className="container">
            <section className="box box--primary">
              <Form onSubmit={handleRegister}>
                <TextInput
                  type="text"
                  name="name"
                  label="Username"
                  placeholder="dicelover666"
                  error={errors.name}
                  onChange={() => clearError("name")}
                />
                <TextInput
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="dicelover666@mail.com"
                  error={errors.email}
                  onChange={() => clearError("email")}
                />
                <TextInput
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Insert password..."
                  error={errors.password}
                  onChange={() => clearError("password")}
                />
                <div className="auth-actions">
                  <button
                    type="submit"
                    className="button button-squere bg-(--black) text-(--white) hover:bg-(--light) mt-5 disable:hover-none disabled:bg-(--light)"
                    disabled={isPending}
                  >
                    {isPending ? "Signing up…" : "Sign up"}
                  </button>

                  <div className="auth-divider" role="separator">
                    <span>or</span>
                  </div>
                  <GoogleButton />
                </div>                
              </Form>
            </section>
          </div>
        </main>
      </>
    )
}