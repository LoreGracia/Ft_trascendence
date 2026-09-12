'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import {
	Trophy,
	Users,
	Zap,
	TrendingUp,
	Medal,
	Flame,
	RefreshCw,
	Swords,
	Dice5,
	Crown,
	Sparkles,
} from 'lucide-react'
import { getLeaderboardStats, getAllUsersDebug, type LeaderboardUserStats } from '@/app/actions/user'
import { AllUsersDebug } from '@/components/AllUsersDebug'

type GameMode = 'FREE_PLAY' | 'ADD42'

const AUTO_REFRESH_SECONDS = 15

interface LeaderboardCardProps {
	gameMode: GameMode
	title: string
	subtitle: string
	icon: React.ReactNode
	players: LeaderboardUserStats[]
	accentColor: {
		badgeBg: string
		badgeText: string
		border: string
		glow: string
		gradient: string
	}
}

function RankBadge({ rank }: { rank: number }) {
	if (rank === 1) {
		return (
			<div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white flex items-center justify-center font-extrabold text-xs shadow-md shadow-indigo-500/30 ring-1 ring-indigo-300">
				<Trophy className="w-3.5 h-3.5 fill-current" />
			</div>
		)
	}

	if (rank === 2) {
		return (
			<div className="w-6 h-6 rounded-full bg-gradient-to-tr from-neutral-300 to-neutral-100 text-neutral-900 flex items-center justify-center font-extrabold text-xs shadow-sm ring-1 ring-neutral-200">
				<Medal className="w-3.5 h-3.5 fill-current" />
			</div>
		)
	}

	if (rank === 3) {
		return (
			<div className="w-6 h-6 rounded-full bg-gradient-to-tr from-neutral-600 to-neutral-500 text-white flex items-center justify-center font-extrabold text-xs shadow-sm ring-1 ring-neutral-600">
				<Medal className="w-3.5 h-3.5 fill-current" />
			</div>
		)
	}

	return (
		<span className="w-6 text-center text-xs font-semibold text-neutral-400">
			{rank}
		</span>
	)
}

function PodiumSpot(
	{
		player,
		rank,
		isFirst = false,
		color,
	}: {
		player: LeaderboardUserStats
		rank: number
		isFirst?: boolean
		color: string
	}
) {
	const diceBearUrl = player.avatarUrl || `https://api.dicebear.com/10.x/sprouts/svg?seed=${encodeURIComponent(player.avatarSeed || player.name)}`

	return (
		<div
			className={`relative flex flex-col items-center p-3 rounded-2xl border text-center transition-transform hover:-translate-y-0.5 ${color} ${isFirst ? '-mt-2 pt-4 bg-gradient-to-b from-indigo-500/20 via-neutral-900 to-neutral-900 border-indigo-500/40 shadow-lg shadow-indigo-500/10' : 'bg-neutral-900/60'
				}`}
		>
			<div className="absolute -top-3">
				{rank === 1 && (
					<div className="p-1 rounded-full bg-indigo-400 text-white shadow-md">
						<Crown className="w-3.5 h-3.5 fill-current" />
					</div>
				)}
				{rank === 2 && (
					<div className="p-1 rounded-full bg-neutral-300 text-neutral-900 shadow-sm text-[10px] font-bold w-5 h-5 flex items-center justify-center">
						2
					</div>
				)}
				{rank === 3 && (
					<div className="p-1 rounded-full bg-neutral-600 text-white shadow-sm text-[10px] font-bold w-5 h-5 flex items-center justify-center">
						3
					</div>
				)}
			</div>

			<div className={`relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 border ${isFirst ? 'border-indigo-400 ring-2 ring-indigo-400/30' : 'border-neutral-700'} mb-1.5 mt-1`}>
				<Image
					src={diceBearUrl}
					alt={player.name}
					width={40}
					height={40}
					className="w-full h-full object-cover"
					unoptimized
				/>
			</div>

			<p className="text-xs font-bold text-white truncate max-w-full w-full">
				{player.name}
			</p>
			<span className="text-[10px] text-emerald-400 font-semibold mt-0.5">
				{player.wins}W • {player.ties}T
			</span>
		</div>
	)
}

function LeaderboardSkeleton() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
			{[1, 2].map((block) => (
				<div key={block} className="lg:col-span-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-2xl bg-neutral-800" />
						<div className="space-y-2">
							<div className="w-32 h-4 rounded bg-neutral-800" />
							<div className="w-48 h-3 rounded bg-neutral-800" />
						</div>
					</div>
					<div className="grid grid-cols-3 gap-3">
						<div className="h-24 rounded-2xl bg-neutral-800/60" />
						<div className="h-28 rounded-2xl bg-neutral-800/80" />
						<div className="h-24 rounded-2xl bg-neutral-800/60" />
					</div>
					<div className="space-y-3">
						{[1, 2, 3, 4, 5, 6].map((row) => (
							<div key={row} className="h-12 rounded-2xl bg-neutral-800/40" />
						))}
					</div>
				</div>
			))}
		</div>
	)
}

function LeaderboardCard(
	{
		gameMode,
		title,
		subtitle,
		icon,
		players,
		accentColor,
	}: LeaderboardCardProps
) {
	return (
		<div className="rounded-2xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col h-full transition-all hover:border-neutral-700">
			<div className="p-6 border-b border-neutral-800 bg-gradient-to-b from-neutral-800/40 to-transparent">
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-3">
						<div className={`p-2.5 rounded-2xl bg-gradient-to-tr ${accentColor.gradient} text-white shadow-lg`}>
							{icon}
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
								<span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${accentColor.badgeBg} ${accentColor.badgeText} border ${accentColor.border}`}>
									Ranking
								</span>
							</div>
							<p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>
						</div>
					</div>

					<div className="text-right">
						<span className="text-xs font-medium text-neutral-400">Total Top</span>
						<p className="text-sm font-bold text-neutral-200">{players.length} Players</p>
					</div>
				</div>

				<div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 bg-neutral-950/40 px-3 py-1.5 rounded-xl border border-neutral-800/50">
					<span className="flex items-center gap-1">
						<Flame className="w-3.5 h-3.5 text-indigo-400" />
						Criteria: <strong className="text-neutral-300 font-semibold">Wins &gt; Ties &gt; Lower Losses</strong>
					</span>
					<span className="text-neutral-400">Top 1-10</span>
				</div>
			</div>

			{players.length >= 3 && (
				<div className="px-6 pt-5 pb-2 grid grid-cols-3 gap-2 sm:gap-3 bg-neutral-950/30 border-b border-neutral-800">
					<PodiumSpot player={players[1]} rank={2} color="border-neutral-400 bg-neutral-400/10 text-neutral-300" />
					<PodiumSpot player={players[0]} rank={1} isFirst color="border-indigo-400 bg-indigo-400/10 text-indigo-300" />
					<PodiumSpot player={players[2]} rank={3} color="border-neutral-600 bg-neutral-600/10 text-neutral-500" />
				</div>
			)}

			<div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
				<div className="space-y-2">
					<div className="grid grid-cols-12 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 py-1.5">
						<div className="col-span-2 sm:col-span-1 text-center">#</div>
						<div className="col-span-5 sm:col-span-6">Player</div>
						<div className="col-span-5 sm:col-span-5 grid grid-cols-3 text-center">
							<span className="text-emerald-400 font-bold" title="Wins">
								W
							</span>
							<span className="text-indigo-400 font-bold" title="Ties">
								T
							</span>
							<span className="text-rose-400 font-bold" title="Losses">
								L
							</span>
						</div>
					</div>

					{players.map((player, index) => {
						const rank = index + 1
						const diceBearUrl = player.avatarUrl || `https://api.dicebear.com/10.x/sprouts/svg?seed=${encodeURIComponent(player.avatarSeed || player.name)}`

						return (
							<div
								key={player.id}
								className={`grid grid-cols-12 items-center px-3 py-2.5 rounded-2xl transition-all duration-200 border ${rank === 1
									? 'bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/15 shadow-sm shadow-indigo-500/5'
									: rank === 2
										? 'bg-neutral-800/40 border-neutral-700/50 hover:bg-neutral-800/60'
										: rank === 3
											? 'bg-neutral-700/10 border-neutral-700/30 hover:bg-neutral-700/20'
											: 'bg-neutral-900/40 border-neutral-800/60 hover:bg-neutral-800/30'
									}`}
							>
								<div className="col-span-2 sm:col-span-1 flex justify-center items-center">
									<RankBadge rank={rank} />
								</div>

								<div className="col-span-5 sm:col-span-6 flex items-center gap-2.5 min-w-0 pr-2">
									<div className="relative w-9 h-9 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700/80 flex-shrink-0 shadow-inner">
										<Image
											src={diceBearUrl}
											alt={player.name}
											width={36}
											height={36}
											className="w-full h-full object-cover"
											unoptimized
										/>
									</div>
									<div className="truncate">
										<div className="flex items-center gap-1.5">
											<span className="text-xs sm:text-sm font-bold text-neutral-100 truncate block">{player.name}</span>
											{rank === 1 && <Crown className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
										</div>
										<span className="text-[10px] text-neutral-400 block truncate">
											{player.totalGames} games • {player.winRate.toFixed(0)}% WR
										</span>
									</div>
								</div>

								<div className="col-span-5 sm:col-span-5 grid grid-cols-3 text-center items-center text-xs sm:text-sm font-semibold">
									<div className="py-1 px-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-0.5">
										{player.wins}
									</div>
									<div className="py-1 px-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mx-0.5">
										{player.ties}
									</div>
									<div className="py-1 px-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-0.5">
										{player.losses}
									</div>
								</div>
							</div>
						)
					})}

					{players.length === 0 && (
						<div className="py-12 text-center text-neutral-400 text-sm">
							No data registered yet for this game mode.
						</div>
					)}
				</div>

				<div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
					<span>Registered games in {title}</span>
					<span className="font-semibold text-neutral-300">
						{players.reduce((acc, curr) => acc + curr.totalGames, 0)} played
					</span>
				</div>
			</div>
		</div>
	)
}

export default function LeaderboardPage() {
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
	const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
	const [displayTime, setDisplayTime] = useState<string>('--:--:-- --')
	const [freePlayData, setFreePlayData] = useState<LeaderboardUserStats[]>([])
	const [add42Data, setAdd42Data] = useState<LeaderboardUserStats[]>([])
	const [debugUsers, setDebugUsers] = useState<Array<{ id: string; name: string; email: string; statsCount: number }>>([])

	useEffect(() => {
		const updateDisplayTime = () => {
			setDisplayTime(
				lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
			)
		}
		updateDisplayTime()
	}, [lastUpdated])

	const sortPlayers = useCallback((playersList: LeaderboardUserStats[]): LeaderboardUserStats[] => {
		return [...playersList].sort((a, b) => {
			if (b.wins !== a.wins) {
				return b.wins - a.wins
			}
			if (b.ties !== a.ties) {
				return b.ties - a.ties
			}
			return a.losses - b.losses
		})
	}, [])

	const fetchLeaderboardData = useCallback(async (isSilent = false) => {
		if (!isSilent) setIsLoading(true)
		setIsRefreshing(true)

		try {
			const response = await getLeaderboardStats()
			setFreePlayData(response.freePlay)
			setAdd42Data(response.add42)

			// 🔴 DEBUG: Cargar todos los usuarios
			const debugData = await getAllUsersDebug()
			setDebugUsers(debugData.users)

			setLastUpdated(new Date())
		} catch (error) {
			console.error('Error fetching leaderboard data:', error)
		} finally {
			setIsLoading(false)
			setIsRefreshing(false)
		}
	}, [])

	useEffect(() => {
		fetchLeaderboardData()
	}, [fetchLeaderboardData])

	useEffect(() => {
		const interval = setInterval(() => {
			fetchLeaderboardData(true)
		}, AUTO_REFRESH_SECONDS * 1000)

		return () => clearInterval(interval)
	}, [fetchLeaderboardData])

	const sortedFreePlay = useMemo(() => sortPlayers(freePlayData).slice(0, 10), [freePlayData, sortPlayers])
	const sortedAdd42 = useMemo(() => sortPlayers(add42Data).slice(0, 10), [add42Data, sortPlayers])

	return (
		<div className="min-h-screen w-full bg-neutral-950 flex">
			<main className="w-full">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					{/* 🔴 COMPONENTE TEMPORAL DEBUG */}
					<AllUsersDebug users={debugUsers} />

					<section className="relative rounded-2xl overflow-hidden mb-8 border border-neutral-800 bg-neutral-950/50 p-6 sm:p-8 backdrop-blur">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
							<div>
								<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-3">
									<Crown className="w-3.5 h-3.5" />
									<span>Competitive Rankings</span>
								</div>
								<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
									<span>Leaderboards</span>
									<Sparkles className="w-6 h-6 text-indigo-400 animate-pulse hidden sm:inline-block" />
								</h1>
								<p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
									Discover the best players in each game mode. Rankings updated in real-time by wins, ties, and game ratio.
								</p>
							</div>

							<div className="flex flex-wrap items-center gap-3 self-start md:self-center">
								<div className="px-3.5 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-2 backdrop-blur-md">
									<span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
									<span>
										Auto-refresh: <strong className="text-neutral-200">{AUTO_REFRESH_SECONDS}s</strong>
									</span>
								</div>

								<button
									onClick={() => fetchLeaderboardData(false)}
									disabled={isRefreshing}
									className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer border border-indigo-400/30"
								>
									<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
									<span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
								</button>
							</div>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-800">
							<div className="flex items-center gap-3">
								<div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
									<Trophy className="w-4 h-4" />
								</div>
								<div>
									<p className="text-xs text-neutral-400">Game Modes</p>
									<p className="text-sm font-bold text-white">2 Competitive</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
									<Users className="w-4 h-4" />
								</div>
								<div>
									<p className="text-xs text-neutral-400">Total Players</p>
									<p className="text-sm font-bold text-white">{Math.max(freePlayData.length, add42Data.length)}</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
									<Zap className="w-4 h-4" />
								</div>
								<div>
									<p className="text-xs text-neutral-400">Server Status</p>
									<p className="text-sm font-bold text-emerald-400">Live (Sync)</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
									<TrendingUp className="w-4 h-4" />
								</div>
								<div>
									<p className="text-xs text-neutral-400">Last Sync</p>
									<p className="text-sm font-bold text-neutral-300">{displayTime}</p>
								</div>
							</div>
						</div>
					</section>

					{isLoading ? (
						<LeaderboardSkeleton />
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
							<div className="lg:col-span-6">
								<LeaderboardCard
									gameMode="FREE_PLAY"
									title="Free Play"
									subtitle="Free matches and quick duels"
									icon={<Dice5 className="w-5 h-5" />}
									players={sortedFreePlay}
									accentColor={{
										badgeBg: 'bg-emerald-500/10',
										badgeText: 'text-emerald-400',
										border: 'border-emerald-500/30',
										glow: 'from-emerald-500/10',
										gradient: 'from-emerald-600 to-teal-600',
									}}
								/>
							</div>
							<div className="lg:col-span-6">
								<LeaderboardCard
									gameMode="ADD42"
									title="Add 42"
									subtitle="Tactical competitive mode to reach 42"
									icon={<Swords className="w-5 h-5" />}
									players={sortedAdd42}
									accentColor={{
										badgeBg: 'bg-indigo-500/10',
										badgeText: 'text-indigo-400',
										border: 'border-indigo-500/30',
										glow: 'from-indigo-500/10',
										gradient: 'from-indigo-600 to-purple-600',
									}}
								/>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	)
}