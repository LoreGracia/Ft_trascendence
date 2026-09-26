import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "/app/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {

	// const SEED_USERS = [
	// 	{ name: "alice",   email: "alice@test.local",   fp: { wins: 6, losses: 2, ties: 2 }, a42: { wins: 2, losses: 1, ties: 1 } },
	// 	{ name: "bob",     email: "bob@test.local",     fp: { wins: 3, losses: 4, ties: 1 }, a42: { wins: 5, losses: 1, ties: 0 } },
	// 	{ name: "charlie", email: "charlie@test.local", fp: { wins: 1, losses: 3, ties: 1 }, a42: { wins: 0, losses: 2, ties: 1 } },
	// ];

	// for (const u of SEED_USERS) {
	// 	const user = await prisma.user.upsert({
	// 		where: { email: u.email },
	// 		update: {},
	// 		create: { id: u.email, name: u.name, email: u.email },
	// 	});

	// 	for (const [gameType, s] of [["FREE_PLAY", u.fp], ["ADD42", u.a42]] as const) {
	// 		const gamesPlayed = s.wins + s.losses + s.ties;
	// 		const totalPoints = s.wins * 3 + s.ties;
	// 		await prisma.userStats.upsert({
	// 			where: { userId_gameType: { userId: user.id, gameType: gameType as GameType } },
	// 			update: { gamesPlayed, wins: s.wins, losses: s.losses, ties: s.ties, totalPoints },
	// 			create: { userId: user.id, gameType: gameType as GameType, gamesPlayed, wins: s.wins, losses: s.losses, ties: s.ties, totalPoints },
	// 		});
	// 	}
	// }

	// console.log("Seed complete");
}

main()
	.then(async () => {
		await prisma.$disconnect();
		await pool.end();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		await pool.end();
		process.exit(1);
	});
