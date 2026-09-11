'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function getCurrentUserProfile() {
    // TODO: Obtener la sesión del usuario autenticado
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || !session.user) {
        throw new Error('Usuario no autenticado')
    }

    const userId = session.user.id

    // TODO: Obtener el usuario con sus stats desde la base de datos
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            stats: true, // Incluye todas las estadísticas del usuario
        },
    })

    if (!user) {
        throw new Error('Usuario no encontrado en la base de datos')
    }

    // TODO: Transformar los datos al formato que espera el frontend
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        stats: user.stats.map((stat) => ({
            gameType: stat.gameType as 'FREE_PLAY' | 'ADD42',
            gamesPlayed: stat.gamesPlayed,
            wins: stat.wins,
            losses: stat.losses,
            ties: stat.ties,
            totalPoints: stat.totalPoints,
        })),
    }
}

export async function updateUserProfile(
    name: string,
    email: string,
    image: string
) {
    // TODO: Obtener la sesión del usuario autenticado
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || !session.user) {
        throw new Error('Usuario no autenticado')
    }

    const userId = session.user.id

    // TODO: Validar que el email no esté en uso por otro usuario
    if (email) {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser && existingUser.id !== userId) {
            throw new Error('Este email ya está en uso')
        }
    }

    // TODO: Actualizar el usuario en la base de datos
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name: name || undefined,
            email: email || undefined,
            image: image || undefined,
            updatedAt: new Date(),
        },
        include: {
            stats: true,
        },
    })

    // TODO: Transformar los datos al formato que espera el frontend
    return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        image: updatedUser.image,
        createdAt: updatedUser.createdAt,
        stats: updatedUser.stats.map((stat) => ({
            gameType: stat.gameType as 'FREE_PLAY' | 'ADD42',
            gamesPlayed: stat.gamesPlayed,
            wins: stat.wins,
            losses: stat.losses,
            ties: stat.ties,
            totalPoints: stat.totalPoints,
        })),
    }
}