import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/user';
import { DEFAULT_STATS } from '@/lib/game-stats';
import { ProfileView } from './ProfileView';
import './Profile.css';

export default async function ProfilePage() {
	const user = await getCurrentUserProfile();
	if (!user) redirect('/login');

	const stats = DEFAULT_STATS.map(
		(empty) => user.stats.find((s) => s.gameType === empty.gameType) ?? empty,
	);

	return <ProfileView user={user} stats={stats} />;
}