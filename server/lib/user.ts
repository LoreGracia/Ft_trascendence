import { prisma } from './prisma';
import { MatchRoom, Players } from '../game/GameTypes';

export async function setEmptyMatchDb(match: MatchRoom) {
    const game = setEmptyGameDb(match);
    updateGameDb(game, match);
}

export async function setEmptyGameDb(match: MatchRoom) {
    try {
        const game = await prisma.game.create({
            data: {
                status: "PLAYING",
                gameType: match.gameType,
                players: {
                    create: match.players.map((p) => ({
                        userId: p.playerId,
                    })),
                    // gameId: match.roomCode,
                    // rolls: [],
                },
            },
            include: {
                players: true,
            }
        });
        return game.id;
    } catch (error) {
        console.error('Error sending the empty match to the db.', error);
        throw error;
    }
}

export async function updateGameDb(match: MatchRoom) {
    try {
        const game = await prisma.game.findUnique({
            where: {
                id: match.matchDbId,
            },
            include: {
                players: true,
            }
        });
        if (!game) {
            throw new Error(`Game with ID ${match.matchDbId} not found.`);
        }
        const gameOperations = prisma.game.update({
            where: {
                id: game.id
            },
            data: {
                status: "FINISHED",
            },
        });

        const playerOperations = game.players.map((player: any) => {
            const matchPlayer = match.players.find((p) => p.playerId === player.userId);
            return prisma.playerGame.update({
                where: {
                    id: player.id,
                },
                data: {
                    outcome: matchPlayer?.state,
                },
            });
        });
        const userStatsOperations = match.players.map((player: any) => {
            const isWin = player.state === "WIN";
            const isLoss = player.state === "LOSE";
            const isTie = player.state === "TIE";

            return prisma.userStats.upsert({
                where: {
                    userId_gameType: {
                        userId: player.playerId,
                        gameType: match.gameType,
                    }
                },
                update: {
                    gamesPlayed: { increment: 1 },
                    wins: isWin ? { increment: 1 } : undefined,
                    losses: isLoss ? { increment: 1 } : undefined,
                    ties: isTie ? { increment: 1 } : undefined,
                },
                create: {
                    userId: player.playerId,
                    gameType: match.gameType,
                    gamesPlayed: 1,
                    wins: isWin ? 1 : 0,
                    losses: isLoss ? 1 : 0,
                    ties: isTie ? 1 : 0,
                },
            });
        });
        await prisma.$transaction([
            gameOperations,
            ...playerOperations,
            ...userStatsOperations,
        ]);
    } catch (error) {
        console.error('Error sending the match to the db.', error);
        throw error;
    }
}

