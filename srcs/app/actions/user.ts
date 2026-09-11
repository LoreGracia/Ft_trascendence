'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * Obtiene el perfil completo del usuario autenticado actualmente,
 * incluyendo sus estadísticas de juego (FREE_PLAY, ADD42, etc.).
 */
export async function getCurrentUserProfile() {
    try {
        // 1. Obtener la sesión actual usando los headers de la petición entrante
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        // 2. Verificar que exista una sesión y un usuario autenticado
        if (!session || !session.user?.id) {
            return null
        }

        // 3. Consultar la base de datos para obtener el usuario y sus estadísticas asociadas
        const user = await prisma.user.findUnique({
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

        return user
    } catch (error) {
        console.error('Error al obtener el perfil del usuario autenticado:', error)
        return null
    }
}

/**
 * Actualiza los datos del perfil del usuario autenticado (nombre, email e imagen).
 */
export async function updateUserProfile(data: {
    name?: string
    email?: string
    image?: string
}) {
    try {
        // 1. Obtener y validar la sesión actual
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session || !session.user?.id) {
            throw new Error('No autorizado: Se requiere una sesión activa.')
        }

        // 2. Limpiar los datos para no sobreescribir con valores undefined
        const updateData: { name?: string; email?: string; image?: string } = {}

        if (data.name !== undefined && data.name.trim() !== '') {
            updateData.name = data.name.trim()
        }

        if (data.email !== undefined && data.email.trim() !== '') {
            updateData.email = data.email.trim()
        }

        if (data.image !== undefined) {
            updateData.image = data.image
        }

        // 3. Realizar la actualización en la base de datos
        const updatedUser = await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: updateData,
            include: {
                stats: true,
            },
        })

        return updatedUser
    } catch (error) {
        console.error('Error al actualizar el perfil del usuario:', error)
        throw error instanceof Error
            ? error
            : new Error('Error desconocido al actualizar el perfil')
    }
}

/**
 * Cambia la contraseña del usuario autenticado.
 * Valida que ambas contraseñas coincidan y tengan longitud mínima.
 */
export async function changePassword(data: {
    newPassword: string
    repeatPassword: string
}) {
    try {
        // 1. Obtener y validar la sesión actual
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session || !session.user?.id) {
            throw new Error('No autorizado: Se requiere una sesión activa.')
        }

        // 2. Validar que ambas contraseñas coincidan
        if (data.newPassword !== data.repeatPassword) {
            throw new Error('Las contraseñas no coinciden')
        }

        // 3. Validar longitud mínima
        if (data.newPassword.length < 8) {
            throw new Error('La contraseña debe tener al menos 8 caracteres')
        }

        // 4. Cambiar contraseña usando better-auth
        const result = await auth.api.changePassword({
            headers: await headers(),
            body: {
                newPassword: data.newPassword,
            },
        })

        if (!result.ok) {
            throw new Error('Error al cambiar la contraseña')
        }

        return { success: true }
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error)
        throw error instanceof Error
            ? error
            : new Error('Error desconocido al cambiar la contraseña')
    }
}