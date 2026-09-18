'use client';

import { useCallback, useMemo, useState } from 'react';
import {
	AVATAR_SEEDS,
	getSeedFromAvatarUrl,
	type AvatarSeed,
} from '@/lib/avatar';

export interface ProfileFormValues {
	name: string;
	email: string;
	seed: AvatarSeed;
}

export interface ProfileFormUser {
	name: string | null;
	email: string;
	image: string | null;
}

function valuesFromUser(user: ProfileFormUser): ProfileFormValues {
	return {
		name: user.name ?? '',
		email: user.email,
		seed: getSeedFromAvatarUrl(user.image) ?? AVATAR_SEEDS[0],
	};
}

export function useProfileForm(user: ProfileFormUser) {
	const initial = useMemo(() => valuesFromUser(user), [user]);
	const [values, setValues] = useState<ProfileFormValues>(initial);

	const set = useCallback(
		<K extends keyof ProfileFormValues>(field: K, value: ProfileFormValues[K]) => {
		setValues((prev) => ({ ...prev, [field]: value }));
		},
		[],
	);

	const reset = useCallback(() => setValues(initial), [initial]);

	return { values, set, reset };
}