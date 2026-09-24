"use client";

import { useState } from "react";
import {
	Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import {
	Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, type LucideIcon,
} from "lucide-react";
import type { LeaderboardUserStats } from "@/lib/user";
import "./LeaderboardCard.css";
import { Avatar } from "../Avatar/Avatar";

type Mode = "FREE_PLAY" | "ADD42";

const RANK_ICONS: LucideIcon[] = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const MODES: { id: Mode; label: string }[] = [
	{ id: "FREE_PLAY", label: "Free Play" },
	{ id: "ADD42", label: "Add 42" },
];

export function LeaderboardCard({
	freePlay,
	add42,
}: {
	freePlay: LeaderboardUserStats[];
	add42: LeaderboardUserStats[];
}) {
	const [mode, setMode] = useState<Mode>("FREE_PLAY");
	const players = mode === "FREE_PLAY" ? freePlay : add42;

	return (
		<div className="lb-card">
			<div className="lb-card__header" role="tablist" aria-label="Game mode">
				{MODES.map((m, i) => {
					const isActive = mode === m.id;
					return (
						<span key={m.id} className="lb-card__tab-wrap">
							{i > 0 && <span className="lb-card__separator" aria-hidden="true">·</span>}
							<button
								role="tab"
								aria-selected={isActive}
								aria-controls={`panel-${m.id}`}
								id={`tab-${m.id}`}
								tabIndex={isActive ? 0 : -1}
								className={`lb-card__tab ${isActive ? "is-active" : ""}`}
								onClick={() => setMode(m.id)}
								onKeyDown={(e) => {
									if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
										setMode(mode === "FREE_PLAY" ? "ADD42" : "FREE_PLAY");
									}
								}}
							>
								{m.label}
							</button>
						</span>
					);
				})}
			</div>

			<div
				className="lb-card__panel"
				role="tabpanel"
				id={`panel-${mode}`}
				aria-labelledby={`tab-${mode}`}
			>
				{players.length === 0 ? (
					<p className="lb-card__empty">No players yet.</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-16 text-left">Rank</TableHead>
								<TableHead className="text-left">Player</TableHead>
								<TableHead className="w-20 text-right text-(--t-success)">Wins</TableHead>
								<TableHead className="w-20 text-right text-(--t-warning)">Ties</TableHead>
								<TableHead className="w-20 text-right text-(--t-danger)">Losses</TableHead>
								<TableHead className="w-24 text-right">Points</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{players.map((player, index) => {
								const RankIcon = RANK_ICONS[index];
								return (
									<TableRow key={player.id}>
										<TableCell className="text-center">
											<span className="sr-only">Rank {index + 1}</span>
											{RankIcon ? (
												<RankIcon size={18} aria-hidden="true" />
											) : (
												<span className="font-bold">#{index + 1}</span>
											)}
										</TableCell>
										<TableCell className="flex flex-row gap-5">
											<Avatar image={player.image} name={player.name} size="xs" />
											{player.name}
										</TableCell>
										<TableCell className="text-right text-(--t-success)">{player.wins}</TableCell>
										<TableCell className="text-right text-(--t-warning)">{player.ties}</TableCell>
										<TableCell className="text-right text-(--t-danger)">{player.losses}</TableCell>
										<TableCell className="text-right">{player.avg}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	);
}