'use server'

import { headers } from 'next/headers'
import { Prisma } from '../generated/prisma/client';
import { auth } from '@/lib/auth'
import { prisma } from './prisma'
import { updateProfileSchema } from '@/lib/validation'

export async function getCurrentUserProfile() {
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session?.user?.id)
		return null;

	try {
		return await prisma.user.findUnique({
			where: {
				id: session.user.id,
			},
			include: {
				stats: {
					orderBy: {
						gameType: 'asc',
					},
				},
			},
		})
	} catch (error) {
		return null;
	}
}

export async function updateUserProfile(input: {
	name?: string
	email?: string
	image?: string
}) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user?.id)
		return { ok: false as const, error: 'Not authorized.' }

	const parsed = updateProfileSchema.safeParse(input);
	if (!parsed.success) {
		const issue = parsed.error.issues[0];
		return {
			ok: false as const,
			field: issue.path[0] as 'name' | 'email' | 'image',
			error: issue.message,
		}
	}

	const updateData: Prisma.UserUpdateInput = {};
	if (parsed.data.name !== undefined)
		updateData.name = parsed.data.name;
	if (parsed.data.email !== undefined)
		updateData.email = parsed.data.email;
	if (parsed.data.image !== undefined)
		updateData.image = parsed.data.image;

	try {
		const user = await prisma.user.update({
			where: { id: session.user.id },
			data: updateData,
			include: { stats: true },
		})
		return { ok: true as const, data: user }
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
			const field = (error.meta?.target as string[] | undefined)?.[0]
			if (field === 'email')
				return { ok: false as const, field: 'email' as const, error: 'That email is already in use.' }
			if (field === 'name')
				return { ok: false as const, field: 'name' as const, error: 'That username is already taken.' }
			return { ok: false as const, error: 'That value is already in use.' }
		}
		return { ok: false as const, error: 'Could not update profile.' }
	}
}

export interface LeaderboardUserStats {
	name: string;
	wins: number;
	ties: number;
	losses: number;
	avg: number;
	image: string;
	id: string
}

export async function fetchLeaderboardStats(): Promise<{
	FreePlay: LeaderboardUserStats[];
	Add42: LeaderboardUserStats[];
}> {
	try {
		const users = await prisma.user.findMany({
			where: { stats: { some: { gamesPlayed: { gt: 0 } } } },
			include: {
				stats: true,
			},
		});
		const freePlayPlayers = users.map((user) => {
			
			const stat = user.stats?.find((s) => s.gameType === 'FREE_PLAY')

			if (!stat || stat.gamesPlayed === 0) return null;

			return {
				name: user.name || 'Unknown',
				image: user.image || null,
				wins: stat.wins || 0,
				ties: stat.ties || 0,
				losses: stat.losses || 0,
				avg: (stat.wins * 3 + stat.ties),
				id: user.id,
			}
		}).filter((p): p is LeaderboardUserStats => p !== null).sort((a, b) => b.avg - a.avg).slice(0, 6)


		const add42Players = users.map((user) => {
			const stat = user.stats?.find((s) => s.gameType === 'ADD42')

			if (!stat || stat.gamesPlayed === 0) return null

			return {
				name: user.name || 'Unknown',
				image: user.image || null,
				wins: stat.wins || 0,
				ties: stat.ties || 0,
				losses: stat.losses || 0,
				avg: (stat.wins * 3 + stat.ties),
				id: user.id,
			}
		}).filter((p): p is LeaderboardUserStats => p !== null).sort((a, b) => b.avg - a.avg).slice(0, 6)
		return {
			FreePlay: freePlayPlayers,
			Add42: add42Players,
		}
	} catch (error) {
		return {
			FreePlay: [],
			Add42: [],
		}
	}
}