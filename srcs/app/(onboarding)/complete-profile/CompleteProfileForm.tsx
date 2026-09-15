"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import TextInput from "@/components/Input/Input";
import { setUsername } from "./actions";
import Form from "@/components/Form/Form";

export default function CompleteProfileForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await setUsername(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/landing");
      router.refresh();
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextInput
        type="text"
        name="username"
        label="Username"
        placeholder="dicelover666"
        error={error ?? undefined}
        onChange={() => setError(null)}
      />
      <button
        type="submit"
        disabled={isPending}
        className="button button-squere button--basic mt-5"
      >
        {isPending ? "Saving…" : "Continue"}
      </button>
    </Form>
  );
}