
import { GameStat } from "@/lib/game-stats";
import { Card } from "./Card"

const GAME_LABELS: Record<GameStat["gameType"], string> = {
	FREE_PLAY: "Free Play",
	ADD42: "Add 42",
};

export function StatCard({ stat }: { stat: GameStat }) {
	return (
		<Card>
			<h3 className="stat-card__title">{GAME_LABELS[stat.gameType]}</h3>
			<dl className="stat-card__grid">
				<Stat label="Games" value={stat.gamesPlayed} />
				<Stat label="Wins" value={stat.wins} tone="success" />
				<Stat label="Losses" value={stat.losses} tone="danger" />
				<Stat label="Ties" value={stat.ties} tone="warning" />
				<Stat label="Total Points" value={stat.totalPoints} tone="accent" size="lg" variant="footer" />
			</dl>
		</Card>
  );
}

function Stat({
		label,
		value,
		tone,
		size = "md",
		variant,
	}: {
		label: string;
		value: number;
		tone?: "success" | "danger" | "warning" | "accent";
		size?: "md" | "lg";
		variant?: "footer";
	}) {
	return (
		<div className={`stat${variant ? ` stat--${variant}` : ""}`}>
			<dt className="stat__label">{label}</dt>
			<dd className="stat__value" data-tone={tone} data-size={size}>
				{value}
			</dd>
		</div>
	);
}