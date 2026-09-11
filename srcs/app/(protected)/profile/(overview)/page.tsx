'use client'

import React, { useState, useEffect } from 'react'
import { getCurrentUserProfile, updateUserProfile, changePassword } from '@/app/actions/user'
import { getAvatarUrl, getAvailableAvatars } from '@/components/3dDice/diceAvatarUtils'
import {
	User,
	Mail,
	Shield,
	Calendar,
	Trophy,
	CheckCircle,
	Edit2,
	Save,
	X,
	Camera,
	Lock,
	Eye,
	EyeOff,
} from 'lucide-react'

interface GameStat {
	gameType: 'FREE_PLAY' | 'ADD42'
	gamesPlayed: number
	wins: number
	losses: number
	ties: number
	totalPoints: number
}

interface UserProfileData {
	id: string
	name: string | null
	email: string | null
	emailVerified: boolean
	image: string | null
	createdAt: string | Date
	stats: GameStat[]
}

export default function ProfilePage() {
	const [userData, setUserData] = useState<UserProfileData>({
		id: '',
		name: null,
		email: null,
		emailVerified: false,
		image: null,
		createdAt: new Date(),
		stats: [
			{
				gameType: 'FREE_PLAY',
				gamesPlayed: 0,
				wins: 0,
				losses: 0,
				ties: 0,
				totalPoints: 0,
			},
			{
				gameType: 'ADD42',
				gamesPlayed: 0,
				wins: 0,
				losses: 0,
				ties: 0,
				totalPoints: 0,
			},
		],
	})

	const [isEditing, setIsEditing] = useState(false)
	const [loading, setLoading] = useState(true)
	const [passwordError, setPasswordError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showRepeatPassword, setShowRepeatPassword] = useState(false)
	const [editForm, setEditForm] = useState({
		name: userData.name || '',
		email: userData.email || '',
		image: userData.image || '',
		newPassword: '',
		repeatPassword: '',
	})
	useEffect(() => {
		const loadUserProfile = async () => {
			try {
				const dbUser = await getCurrentUserProfile()
				if (dbUser) {
					setUserData({
						id: dbUser.id,
						name: dbUser.name,
						email: dbUser.email,
						emailVerified: dbUser.emailVerified,
						image: dbUser.image,
						createdAt: dbUser.createdAt,
						stats: dbUser.stats || [],
					})
				}
			} catch (error) {
				console.error('Error loading profile:', error)
			} finally {
				setLoading(false)
			}
		}
		loadUserProfile()
	}, [])

	const displayValue = (value: string | number | null) => {
		return value && value !== '' ? value : '—'
	}

	const formatDate = (dateValue: string | Date) => {
		if (!dateValue) return '—'
		const date = new Date(dateValue)
		return new Intl.DateTimeFormat('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}).format(date)
	}

	const getStat = (type: 'FREE_PLAY' | 'ADD42'): GameStat => {
		return (
			userData.stats.find((s) => s.gameType === type) || {
				gameType: type,
				gamesPlayed: 0,
				wins: 0,
				losses: 0,
				ties: 0,
				totalPoints: 0,
			}
		)
	}

	const startEditing = () => {
		setPasswordError(null)
		setSuccessMessage(null)
		let currentSeed = 'avatar-1'
		if (userData.image && userData.image.includes('dicebear')) {
			const seedMatch = userData.image.match(/seed=([^&]+)/)
			if (seedMatch) {
				currentSeed = decodeURIComponent(seedMatch[1])
			}
		}
		setEditForm({
			name: userData.name || '',
			email: userData.email || '',
			image: userData.image || '',
			selectedAvatarSeed: currentSeed,
			newPassword: '',
			repeatPassword: '',
		})
		setIsEditing(true)
	}

	const cancelEditing = () => {
		setIsEditing(false)
		setPasswordError(null)
		setSuccessMessage(null)
		let currentSeed = 'avatar-1'
		if (userData.image && userData.image.includes('dicebear')) {
			const seedMatch = userData.image.match(/seed=([^&]+)/)
			if (seedMatch) {
				currentSeed = decodeURIComponent(seedMatch[1])
			}
		}
		setEditForm({
			name: userData.name || '',
			email: userData.email || '',
			image: userData.image || '',
			selectedAvatarSeed: currentSeed,
			newPassword: '',
			repeatPassword: '',
		})
	}

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault()
		setPasswordError(null)
		setSuccessMessage(null)

		try {
			// TODO: Validar que las contraseñas coincidan si se proporcionan
			if (editForm.newPassword || editForm.repeatPassword) {
				if (editForm.newPassword !== editForm.repeatPassword) {
					setPasswordError('Passwords do not match')
					return
				}

				if (editForm.newPassword.length < 8) {
					setPasswordError('Password must be at least 8 characters')
					return
				}
			}

			// Generar URL del avatar seleccionado
			const avatarUrl = getAvatarUrl(editForm.selectedAvatarSeed)

			// TODO: Actualizar datos de perfil en la BD
			const updated = await updateUserProfile({
				name: editForm.name,
				email: editForm.email,
				image: avatarUrl,
			})

			if (updated) {
				setUserData({
					...userData,
					name: updated.name,
					email: updated.email,
					image: updated.image,
				})

				// TODO: Cambiar contraseña si se proporcionó una nueva
				if (editForm.newPassword) {
					await changePassword({
						newPassword: editForm.newPassword,
						repeatPassword: editForm.repeatPassword,
					})
				}

				setSuccessMessage('Profile updated successfully!')
				setIsEditing(false)

				// Limpiar mensaje de éxito después de 3 segundos
				setTimeout(() => setSuccessMessage(null), 3000)
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Error updating profile'
			setPasswordError(errorMessage)
			console.error('Error updating profile:', error)
		}
	}

	const handleInputChange = (field: string, value: string) => {
		setEditForm((prev) => ({
			...prev,
			[field]: value,
		}))
	}

	const freePlayStat = getStat('FREE_PLAY')
	const add42Stat = getStat('ADD42')

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-neutral-950">
				<div className="text-white text-xl font-semibold">Loading your profile...</div>
			</div>
		)
	}

	return (
		<main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			{/* Banner de Fondo / Cabecera decorativa */}
			<div className="relative mb-6 h-36 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-neutral-900 border border-neutral-800">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
			</div>

			{/* Grid con el contenido */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
				{/* Card de perfil lateral */}
				<aside className="lg:col-span-3">
					<div className="sticky top-24 space-y-4">
						{/* Foto de perfil y nombre */}
						<div className="rounded-2xl border border-neutral-800 bg-neutral-950/50 p-6 text-center backdrop-blur">
							<div className="mb-4 flex justify-center">
								<div className="relative">
									{userData.image ? (
										<img
											src={userData.image}
											alt={userData.name || 'User'}
											className="h-32 w-32 rounded-full object-cover shadow-lg"
										/>
									) : (
										<div className="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
											{userData.name ? userData.name.charAt(0).toUpperCase() : '?'}
										</div>
									)}
								</div>
							</div>

							<h1 className="text-2xl font-bold text-white">
								{displayValue(userData.name)}
							</h1>

							{userData.emailVerified && (
								<div className="mt-2 inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400 flex items-center gap-1">
									<CheckCircle className="h-3 w-3" />
									Email Verified
								</div>
							)}

							{!isEditing && (
								<button
									onClick={startEditing}
									className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600/20 px-4 py-2 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-600/30"
								>
									<Edit2 className="h-4 w-4" />
									Edit Profile
								</button>
							)}
						</div>

						{/* Stats de juegos */}
						<div className="space-y-3">
							<h3 className="text-sm font-semibold text-neutral-300">
								Game Statistics
							</h3>

							{/* FREE_PLAY Stats */}
							<div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4 backdrop-blur">
								<div className="text-xs font-bold text-indigo-400 mb-3 uppercase">
									Free Play
								</div>
								<div className="grid grid-cols-2 gap-2 text-xs">
									<div>
										<div className="text-neutral-400">Games</div>
										<div className="text-lg font-bold text-white">
											{freePlayStat.gamesPlayed}
										</div>
									</div>
									<div>
										<div className="text-neutral-400">Wins</div>
										<div className="text-lg font-bold text-green-400">
											{freePlayStat.wins}
										</div>
									</div>
									<div>
										<div className="text-neutral-400">Losses</div>
										<div className="text-lg font-bold text-red-400">
											{freePlayStat.losses}
										</div>
									</div>
									<div>
										<div className="text-neutral-400">Ties</div>
										<div className="text-lg font-bold text-yellow-400">
											{freePlayStat.ties}
										</div>
									</div>
								</div>
								<div className="mt-3 pt-3 border-t border-neutral-700">
									<div className="text-xs text-neutral-400">Total Points</div>
									<div className="text-xl font-bold text-indigo-400">
										{freePlayStat.totalPoints}
									</div>
								</div>
							</div>

							{/* ADD42 Stats */}
							<div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4 backdrop-blur">
								<div className="text-xs font-bold text-purple-400 mb-3 uppercase">
									Add42
								</div>
								<div className="grid grid-cols-2 gap-2 text-xs">
									<div>
										<div className="text-neutral-400">Games</div>
										<div className="text-lg font-bold text-white">
											{add42Stat.gamesPlayed}
										</div>
									</div>
									<div>
										<div className="text-neutral-400">Wins</div>
										<div className="text-lg font-bold text-green-400">
											{add42Stat.wins}
										</div>
									</div>
									<div>
										<div className="text-neutral-400">Losses</div>
										<div className="text-lg font-bold text-red-400">
											{add42Stat.losses}
										</div>
									</div>
									<div>
										<div className="text-neutral-400">Ties</div>
										<div className="text-lg font-bold text-yellow-400">
											{add42Stat.ties}
										</div>
									</div>
								</div>
								<div className="mt-3 pt-3 border-t border-neutral-700">
									<div className="text-xs text-neutral-400">Total Points</div>
									<div className="text-xl font-bold text-purple-400">
										{add42Stat.totalPoints}
									</div>
								</div>
							</div>
						</div>
					</div>
				</aside>

				{/* Contenido principal */}
				<div className="lg:col-span-9">
					{/* Sección de información de contacto */}
					<section className="space-y-6">
						<div>
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-bold text-white">
									Personal Information
								</h2>
							</div>

							{/* Mensajes de éxito/error */}
							{successMessage && (
								<div className="mb-4 rounded-lg bg-green-500/20 border border-green-500/30 p-4 text-green-400">
									✓ {successMessage}
								</div>
							)}

							{passwordError && (
								<div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/30 p-4 text-red-400">
									✗ {passwordError}
								</div>
							)}

							{isEditing ? (
								<form
									onSubmit={handleSave}
									className="space-y-6 rounded-xl border border-neutral-800 bg-neutral-950/50 p-6 backdrop-blur"
								>
									{/* Preview en vivo del Avatar */}
									<div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
										<div className="relative">
											{editForm.image ? (
												<img
													src={editForm.image}
													alt="Avatar preview"
													className="h-24 w-24 rounded-full object-cover ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20 bg-neutral-950"
												/>
											) : (
												<img
													src={getAvatarUrl(editForm.selectedAvatarSeed)}
													alt="Avatar preview"
													className="h-24 w-24 rounded-full object-cover ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20 bg-neutral-950"
												/>
											)}
											<span className="absolute -bottom-1 -right-1 rounded-full bg-indigo-600 p-1.5 text-white shadow">
												<Camera className="h-3.5 w-3.5" />
											</span>
										</div>
										<div className="text-center sm:text-left">
											<div className="text-sm font-semibold text-white">Avatar Preview</div>
											<p className="text-xs text-neutral-400 mt-1">
												Select an avatar from the grid below
											</p>
										</div>
									</div>

									{/* Nombre */}
									<div>
										<label className="block text-sm font-medium text-neutral-300 mb-2">
											Full Name
										</label>
										<input
											type="text"
											value={editForm.name}
											onChange={(e) => handleInputChange('name', e.target.value)}
											className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
											placeholder="Your name"
										/>
									</div>

									{/* Email */}
									<div>
										<label className="block text-sm font-medium text-neutral-300 mb-2">
											Email Address
										</label>
										<input
											type="email"
											value={editForm.email}
											onChange={(e) => handleInputChange('email', e.target.value)}
											className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
											placeholder="your.email@example.com"
										/>
									</div>

									{/* Selector de Avatares */}
									<div>
										<label className="text-sm font-medium text-neutral-300 mb-3 block">
											Choose Your Avatar
										</label>
										<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
											{getAvailableAvatars().map((avatar) => {
												const isSelected = editForm.selectedAvatarSeed === avatar.seed
												return (
													<button
														type="button"
														key={avatar.seed}
														onClick={() => {
															setEditForm((prev) => ({
																...prev,
																selectedAvatarSeed: avatar.seed,
																image: avatar.url,
															}))
														}}
														className={`group relative rounded-xl overflow-hidden transition-all duration-200 ${isSelected
															? 'ring-2 ring-indigo-500 scale-105 shadow-lg shadow-indigo-500/30'
															: 'ring-1 ring-neutral-700 hover:ring-neutral-600 hover:scale-102'
															}`}
													>
														<img
															src={avatar.url}
															alt={avatar.seed}
															className="w-full h-auto aspect-square object-cover bg-neutral-900"
															loading="lazy"
														/>
														{isSelected && (
															<div className="absolute inset-0 flex items-center justify-center bg-black/30">
																<CheckCircle className="h-6 w-6 text-indigo-400" />
															</div>
														)}
													</button>
												)
											})}
										</div>
									</div>

									{/* Separador - Sección de contraseña */}
									<div className="border-t border-neutral-700 pt-4">
										<h3 className="text-sm font-semibold text-neutral-300 mb-4 flex items-center gap-2">
											<Lock className="h-4 w-4" />
											Change Password (Optional)
										</h3>

										{/* New Password */}
										<div className="mb-3">
											<label className="block text-sm font-medium text-neutral-300 mb-2">
												New Password
											</label>
											<div className="relative">
												<input
													type={showNewPassword ? 'text' : 'password'}
													value={editForm.newPassword}
													onChange={(e) => handleInputChange('newPassword', e.target.value)}
													className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 pr-10 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
													placeholder="Enter new password (min 8 characters)"
												/>
												<button
													type="button"
													onClick={() => setShowNewPassword(!showNewPassword)}
													className="absolute right-3 top-2 text-neutral-400 hover:text-indigo-400 cursor-pointer transition-colors"
												>
													{showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
												</button>
											</div>
										</div>

										{/* Repeat Password */}
										<div>
											<label className="block text-sm font-medium text-neutral-300 mb-2">
												Repeat Password
											</label>
											<div className="relative">
												<input
													type={showRepeatPassword ? 'text' : 'password'}
													value={editForm.repeatPassword}
													onChange={(e) => handleInputChange('repeatPassword', e.target.value)}
													className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 pr-10 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
													placeholder="Repeat new password"
												/>
												<button
													type="button"
													onClick={() => setShowRepeatPassword(!showRepeatPassword)}
													className="absolute right-3 top-2 text-neutral-400 hover:text-indigo-400 cursor-pointer transition-colors"
												>
													{showRepeatPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
												</button>
											</div>
											<p className="mt-1 text-xs text-neutral-400">
												Passwords must match and be at least 8 characters long
											</p>
										</div>
									</div>

									{/* Botones */}
									<div className="flex gap-3 pt-4">
										<button
											type="submit"
											className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
										>
											<Save className="h-4 w-4" />
											Save
										</button>
										<button
											type="button"
											onClick={cancelEditing}
											className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
										>
											<X className="h-4 w-4" />
											Cancel
										</button>
									</div>
								</form>
							) : (
								<div className="grid gap-4 sm:grid-cols-2">
									{/* Nombre */}
									<div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 backdrop-blur">
										<div className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-2">
											<User className="h-4 w-4 text-indigo-400" />
											Full Name
										</div>
										<p className="text-white">
											{displayValue(userData.name)}
										</p>
									</div>

									{/* Email */}
									<div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 backdrop-blur">
										<div className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-2">
											<Mail className="h-4 w-4 text-purple-400" />
											Email Address
										</div>
										<p className="text-white break-all">
											{displayValue(userData.email)}
										</p>
									</div>

									{/* Fecha de registro */}
									<div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 backdrop-blur">
										<div className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-2">
											<Calendar className="h-4 w-4 text-green-400" />
											Joined Date
										</div>
										<p className="text-white">
											{formatDate(userData.createdAt)}
										</p>
									</div>

									{/* Estado de verificación */}
									<div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 backdrop-blur">
										<div className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-2">
											<Shield className="h-4 w-4 text-blue-400" />
											Email Verified
										</div>
										<p className="text-white">
											{userData.emailVerified ? (
												<span className="text-green-400">✓ Yes</span>
											) : (
												<span className="text-red-400">✗ No</span>
											)}
										</p>
									</div>
								</div>
							)}
						</div>
					</section>
				</div>
			</div>
		</main>
	)
}