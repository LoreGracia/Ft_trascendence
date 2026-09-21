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

export async function getLeaderboardStats() {
	const users = await prisma.user.findMany({ include: { stats: true }, })
	try {
		const freePlayPlayers = users
			.map((user) => {
				const stat = user.stats?.find((s) => s.gameType === 'FREE_PLAY')

				if (!stat || stat.gamesPlayed === 0) return null

				return {
					id: user.id,
					name: user.name || 'Unknown',
					avatarSeed: user.name || 'default',
					avatarUrl: user.image || undefined,
					wins: stat.wins || 0,
					ties: stat.ties || 0,
					losses: stat.losses || 0,
					totalGames: stat.gamesPlayed,
					winRate: stat.gamesPlayed > 0 ? (stat.wins / stat.gamesPlayed) * 100 : 0,
				}
			})
			.filter((p): p is LeaderboardUserStats => p !== null)

		const add42Players = users
			.map((user) => {
				const stat = user.stats?.find((s) => s.gameType === 'ADD42')

				if (!stat || stat.gamesPlayed === 0) return null

				return {
					id: user.id,
					name: user.name || 'Unknown',
					avatarSeed: user.name || 'default',
					avatarUrl: user.image || undefined,
					wins: stat.wins || 0,
					ties: stat.ties || 0,
					losses: stat.losses || 0,
					totalGames: stat.gamesPlayed,
					winRate: stat.gamesPlayed > 0 ? (stat.wins / stat.gamesPlayed) * 100 : 0,
				}
			})
			.filter((p): p is LeaderboardUserStats => p !== null)
		return {
			freePlay: freePlayPlayers,
			add42: add42Players,
		}
	} catch (error) {
		return {
			freePlay: [],
			add42: [],
		}
	}
}

// Tipos para leaderboard
export interface LeaderboardUserStats {
	id: string
	name: string
	avatarSeed: string
	avatarUrl?: string
	wins: number
	ties: number
	losses: number
	totalGames: number
	winRate: number
}


/**
 * TEMPORAL: DEBUG  PARA LEADERBARD- Obtener TODOS los usuarios registrados (sin filtrar por stats)
 * ELIMINAR UNA VEZ LA CONEXIÓN BACKEND→DB FUNCIONE
 */
export async function getAllUsersDebug() {
	try {
		const users = await prisma.user.findMany({
			include: {
				stats: true,
			},
		})

		return {
			total: users.length,
			users: users.map((user) => ({
				id: user.id,
				name: user.name,
				email: user.email,
				statsCount: user.stats.length,
				stats: user.stats,
			})),
		}
	} catch (error) {
		console.error('Error fetching all users:', error)
		return { total: 0, users: [] }
	}
}