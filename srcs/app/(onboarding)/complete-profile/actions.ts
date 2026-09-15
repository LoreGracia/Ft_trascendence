"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { usernameSchema } from "@/lib/validation";

type Result = { ok: true } | { ok: false; error: string };

export async function setUsername(formData: FormData): Promise<Result> {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) return { ok: false, error: "Not authenticated" };
	if (session.user.name) return { ok: false, error: "Username already set" };

	const parsed = usernameSchema.safeParse(formData.get("username"));
	if (!parsed.success) {
		return { ok: false, error: parsed.error.issues[0].message };
	}

	const username = parsed.data;

	const existing = await prisma.user.findFirst({
		where: { name: username, NOT: { id: session.user.id } },
		select: { id: true },
	});

	if (existing) return { ok: false, error: "Username already taken" };

	await prisma.user.update({
		where: { id: session.user.id },
		data: { name: username },
	});

	return { ok: true };
}