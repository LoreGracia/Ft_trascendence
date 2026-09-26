import { fetchLeaderboardStats } from "@/lib/user";
import { LeaderboardCard } from "@/components/Leaderboard/LeaderboardCard";
import "./page.css";

export default async function LeaderboardPage() {
	const stats = await fetchLeaderboardStats();

	return (
		<div className="container">
			<div className="leaderboard-page">
				<header className="leaderboard-page__header">
					<h1 className="leaderboard-page__title">Leaderboard</h1>
					<p className="leaderboard-page__subtitle">
						Ur not here, ur a loser.
					</p>
				</header>
				<LeaderboardCard freePlay={stats.FreePlay} add42={stats.Add42} />
				<div className="leaderboard-page__info">
					<p>
						Each <strong className="text-(--t-success)">Win</strong> grants{" "}
						<strong>3 points</strong> and each{" "}
						<strong className="text-(--t-warning)">Tie</strong> grants{" "}
						<strong>1 point</strong>.
					</p>
				</div>
			</div>
		</div>
	);
}