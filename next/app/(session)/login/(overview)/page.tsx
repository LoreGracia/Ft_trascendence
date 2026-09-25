"use client";
import Link from 'next/link';
import PatternControl from "@/components/Pattern/PatternControl";
import { useState, useTransition } from "react";
import { loginSchema } from "@/lib/validation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import TextInput from '@/components/Input/Input';
import { GithubButton } from "@/components/button/GithubButton";
import AuthForm from '@/components/Form/AuthForm';

export default function LogIn() {
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

	async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const rawData = {
			email: formData.get("email"),
			password: formData.get("password"),
		};

		const result = loginSchema.safeParse(rawData);
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
			const { error } = await authClient.signIn.email(result.data, {
				onSuccess: () => router.push("/landing"),
			});

			if (error) {
				setErrors({ password: error.message ?? "Invalid email or password" });
			}
		});
	}
	return (
		<>
		<PatternControl
			paused={paused}
			onToggle={() => setPaused(!paused)}
		/>
		<main className="container flex flex-auto justify-center items-center">
			<Link
				className="corner-right button button-squere button--highlight"
				href={'/signup'}
				target="_self"
				rel="noopener noreferrer"
			>
				Sign up
			</Link>
			<div className="container">
				<section className="box box--primary">
					<AuthForm onSubmit={handleLogin}>
						<TextInput
							type="email"
							name="email"
							label="Email"
							placeholder="dicelover666@mail.com"
							error={errors.email}
							onChange={() => clearError("email")}
							disabled={isPending}
						/>
						<TextInput
							type="password"
							name="password"
							label="Password"
							placeholder="Insert password..."
							error={errors.password}
							onChange={() => clearError("password")}
							disabled={isPending}
						/>

						<div className="auth-actions">
							<button
								type="submit"
								className="button button-squere button--highlight hover:bg-(--light) disabled:hover-none disabled:bg-(--light)"
								disabled={isPending}
								>
								{isPending ? "Logging in…" : "Login"}
							</button>

							<div className="auth-divider" role="separator">
								<span>or</span>
							</div>
							<GithubButton />
						</div>
					</AuthForm>
				</section>
			</div>
		</main>
		</>
	)
}