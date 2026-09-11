/**
 * Utilidades para generar avatares con DiceBear Sprouts
 * URLs on-demand, zero overhead
 */

export const AVATAR_SEEDS = [
    'avatar-one',
    'avatar-two',
    'avatar-three',
    'avatar-four',
    'avatar-five',
    'avatar-six',
    'avatar-seven',
    'avatar-eight',
    'avatar-nine',
    'avatar-ten',
    'avatar-eleven',
    'avatar-twelve',
] as const

export type AvatarSeed = (typeof AVATAR_SEEDS)[number]

/**
 * Genera URL de avatar DiceBear Sprouts
 */
export const getAvatarUrl = (seed: string): string => {
    return `https://api.dicebear.com/10.x/sprouts/svg?seed=${seed}`
}

/**
 * Retorna todos los avatares disponibles
 */
export const getAvailableAvatars = (): Array<{ seed: string; url: string }> => {
    return AVATAR_SEEDS.map((seed) => ({
        seed,
        url: getAvatarUrl(seed),
    }))
}