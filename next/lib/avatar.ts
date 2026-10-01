export const AVATAR_SEEDS = [
	'lore',
	'JOAN',
	'ALBA',
	'EINA',
	'PATRI',
	'42',
	'LORE',
	'PINGU',
	'pingu',
	'fucked-by-jsebasti',
	'avatar-five',
	'avatar-seven',
	'avatar-eight',
	'avatar-nine',
	'avatar-ten',
	'avatar-eleven',
	'feliz',
	'fishcande',
	'coco',
	'avatar-sixteen',
	'avatar-eighteen',
	'avatar-nineteen',
	'c',
	'd',
	'e',
	'f',
	'i',
	'j',
	'papa',
	'pepe',
	'mocatriz',
	'uo',
	'verano',
	'dannyel',
	'gasroman',
	'...',
	'mart@',
	'lila',
	'madagascar',
	'tulip',
	'^v^',
	'T.T',
] as const

export type AvatarSeed = (typeof AVATAR_SEEDS)[number]

export const getAvatarUrl = (seed: string): string => {
	return `https://api.dicebear.com/10.x/sprouts/svg?seed=${seed}`
}

export const getAvailableAvatars = (): Array<{ seed: string; url: string }> => {
	return AVATAR_SEEDS.map((seed) => ({
		seed,
		url: getAvatarUrl(seed),
	}))
}

export const getSeedFromAvatarUrl = (url: string | null | undefined): AvatarSeed | null => {
	if (!url) return null;
	try {
		const seed = new URL(url).searchParams.get('seed');
		return seed && (AVATAR_SEEDS as readonly string[]).includes(seed)
			? (seed as AvatarSeed)
			: null;
	} catch {
		return null;
	}
};