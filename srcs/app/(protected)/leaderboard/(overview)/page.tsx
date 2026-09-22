import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

import { fetchLeaderboardStats, type LeaderboardUserStats } from '@/app/actions/user'

export interface GameModeStats {
	modeName: string;
	players: LeaderboardUserStats[];
}

interface MultiTableProps {
	modesData: GameModeStats[];
}

const stats = await fetchLeaderboardStats();

const modesData: GameModeStats[] = [
	{ modeName: "Fast Play", players: stats.FreePlay },
	{ modeName: "ADD42", players: stats.Add42 },
];

export default function LeaderboardPage() {
	return (
		<div className="min-h-screen w-full">
			<main className="w-full">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

					<div className="flex flex-col items-center justify-center text-center gap-6 mt-20">
						<div>
							<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
								<span>Leaderboard</span>
							</h1>
							<p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
								Ur not here, ur a looser.
							</p>
						</div>
					</div>
					<div className="flex flex-col gap-10 w-full max-w-2xl mx-auto mt-4">
						{modesData.map((modeGroup, modeIndex) => (
							<div
								key={modeGroup.modeName || modeIndex}
								className="rounded-md ring ring-(--light) p-4 bg-(--light)">
								<h2 className="text-lg font-bold text-white mb-3">
									{modeGroup.modeName}
								</h2>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-16 text-center text-base">Pos.</TableHead>
											<TableHead className="text-left text-base">Player</TableHead>
											<TableHead className="w-24 text-right text-base text-(--t-success)">Wins</TableHead>
											<TableHead className="w-24 text-right text-base text-(--t-warning)">Ties</TableHead>
											<TableHead className="w-24 text-right text-base text-(--t-danger)">Losses</TableHead>
											<TableHead className="w-28 text-right text-base">Average</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{modeGroup.players.map((player, index) => (
											<TableRow key={`${player.name}-${index}`}>
												<TableCell className="text-center font-bold">#{index + 1}</TableCell>
												<TableCell className="text-left font-medium">{player.name}</TableCell>
												<TableCell className="text-right font-medium text-(--t-success)">{player.wins}</TableCell>
												<TableCell className="text-right font-medium text-(--t-warning)">{player.ties}</TableCell>
												<TableCell className="text-right font-medium text-(--t-danger)">{player.losses}</TableCell>
												<TableCell className="text-right font-medium">{player.avg}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						))}
					</div>
					<div className="mt-8 flex justify-center w-full">
						<div className="rounded-md ring ring-(--light) p-4 bg-(--light) text-center max-w-md w-full">
							<p className="text-base text-white/90 font-medium">
								Each <span className="font-bold text-(--t-success)">Win</span> grants <span className="font-bold text-white">3 points</span> and each <span className="font-bold text-(--t-warning)">Tie</span> grants <span className="font-bold text-white">1 point</span>.
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}