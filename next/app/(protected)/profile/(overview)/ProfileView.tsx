'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card/Card';
import { StatCard } from '@/components/Card/StatCard';
import { ProfileInfoCard } from '@/components/Card/ProfileInfoCard';
import { Avatar } from '@/components/Avatar/Avatar';
import { Edit2, User, Mail, Calendar } from 'lucide-react';
import type { GameStat } from '@/lib/game-stats';
import type { Prisma } from '@/generated/prisma';
import { ProfileFormValues, useProfileForm } from '@/hooks/useProfileForm';
import { ProfileEditForm } from '@/components/Form/ProfileEditForm';
import { getAvatarUrl } from '@/lib/avatar';
import { updateUserProfile } from '@/lib/user';

type ProfileUser = Prisma.UserGetPayload<{ include: { stats: true } }>;

function displayValue(value: string | number | null) {
	return value && value !== '' ? value : '—';
}

function formatDate(dateValue: string | Date) {
	if (!dateValue)
		return '—';
	return new Intl.DateTimeFormat('en-EN', {
		year: 'numeric', month: 'long', day: 'numeric',
	}).format(new Date(dateValue));
}

export function ProfileView({ user, stats }: { user: ProfileUser; stats: GameStat[] }) {

	const [isEditing, setIsEditing] = useState(false);
	// const { values, set, reset, clearPasswords } = useProfileForm(user);
	const router = useRouter();

	async function handleSubmit(values: ProfileFormValues) {
		const result = await updateUserProfile({
			name: values.name,
			email: values.email || undefined,
			image: getAvatarUrl(values.seed),
		});
		if (!result.ok)
			return { field: result.field, error: result.error };
		setIsEditing(false);
		router.refresh();
		return null;
	}
	return (
		<div className="profile-scroll">
			<div className="profile-layout">
				{/* <div className="profile-banner" /> */}
				<div className="profile-columns">
					<aside className="profile-sidebar">
						<Card className="card--padded profile-header">
							<Avatar image={user.image} name={user.name} size="lg" />
							<h1 className="profile-header__name">{displayValue(user.name)}</h1>
							{!isEditing && (
									<button
									type="button"
									className="button button-squere button--secondary"
									onClick={() => setIsEditing(true)}
								>
									<Edit2 size={14} />
									Edit Profile
								</button>
							)}
						</Card>

					</aside>
					<section>
						{isEditing ? (
							<ProfileEditForm
								user={user}
								onSubmit={handleSubmit}
								onCancel={() => setIsEditing(false)}
							/>
						) : (
						<>
							<h2 className="section-title">Personal Information</h2>
							<div className="info-grid">
								<ProfileInfoCard icon={User} label="Username" value={displayValue(user.name)} />
								<ProfileInfoCard icon={Mail} label="Email Address" value={displayValue(user.email)} />
								<ProfileInfoCard icon={Calendar} label="Joined Date" value={formatDate(user.createdAt)} />
							</div>
							<div className="stats-grid">
								<h2 className="stats-title ">Game Statistics</h2>
								{stats.map((stat) => (
								<StatCard key={stat.gameType} stat={stat} />
								))}
							</div>
						</>
						)}
					</section>
				</div>
			</div>
		</div>
	);
}